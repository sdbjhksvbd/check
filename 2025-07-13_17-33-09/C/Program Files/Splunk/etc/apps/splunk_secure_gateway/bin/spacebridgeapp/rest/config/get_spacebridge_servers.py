"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for getting spacebridge regions
"""
import json
import logging
import sys
import requests
import os
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'

import splunk
from splunk.persistconn.application import PersistentServerConnectionApplication
from splunk.clilib.bundle_paths import make_splunkhome_path

sys.path.append(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.append(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from http import HTTPStatus
from cloudgateway.splunk.encryption import SplunkEncryptionContext
from cloudgateway.private.sodium_client import SodiumClient
from cloudgateway.discovery import query_discovery_instances
from spacebridgeapp.rest.base_endpoint import BaseRestHandler

from spacebridgeapp.util.constants import SPACEBRIDGE_APP_NAME, AUTHTOKEN, SESSION, STATUS, PAYLOAD, SPACEBRIDGE_SERVER, \
    HTTP_DOMAIN, INSTANCE_CONFIG_COLLECTION_NAME, SERVER, RT
from spacebridge_protocol import discovery_pb2
from spacebridgeapp.util.config import SecureGatewayConfig
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject as kvstore
from itertools import groupby
from operator import itemgetter
from statistics import mean
import concurrent.futures

class SpacebridgeServers(BaseRestHandler, PersistentServerConnectionApplication):
    """
    Main class for handling the spacebridge_servers endpoint. Subclasses the spacebridge_app
    BaseRestHandler.
    """

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="rest_spacebridge_servers")
        self.sodium_client = SodiumClient()

    def get(self, request):
        """
          This will return the list of spacebridge servers from spacebridge discovery.

          :param request
          :return:
          """

        # Setup
        system_authtoken = request['system_authtoken']
        config = self.config
        session_token = request[SESSION][AUTHTOKEN]
        encryption_context = SplunkEncryptionContext(system_authtoken, SPACEBRIDGE_APP_NAME, SodiumClient(self.log))

        # Get spacebridge server
        current_spacebridge_server_url = get_current_spacebridge_server(config, self.log, session_token)

        # Get all possible spacebridge servers from discovery
        spacebridge_instances_response = query_discovery_instances(encryption_context, config)

        spacebridge_instances = discovery_pb2.SpacebridgeInstancesResponse()
        spacebridge_instances.ParseFromString(spacebridge_instances_response.instances)

        # Get spacebridge response times
        response_times = get_spacebridge_response_times(config, self.log, spacebridge_instances.instances)

        # Construct all spacebridge instance objects from discovery
        spacebridge_instances_array = [{'http_domain': x.httpDomain,
                                        'grpc_domain': x.grpcDomain,
                                        'region': x.region,
                                        'label': x.regionLabel,
                                        'description': x.regionDescription,
                                        'instance_id': x.instanceId,
                                        'id': x.id,
                                        'current': x.httpDomain == current_spacebridge_server_url,
                                        'response_time': response_times[x.httpDomain]}
                                       for x in spacebridge_instances.instances]

        return {
            STATUS: HTTPStatus.OK,
            PAYLOAD: {'result': 'ok', 'payload': spacebridge_instances_array}
        }


def get_current_spacebridge_server(config: SecureGatewayConfig, log: logging.Logger, session_token: str) -> str:
    
    default_spacebridge_server = config.get_spacebridge_server()
    
    try:
        spacebridge_bundle = get_current_spacebridge_server_bundle(log, session_token)
        spacebridge_server_url = spacebridge_bundle.get(HTTP_DOMAIN, default_spacebridge_server)
    except Exception as e:
        log.debug(str(e))
        spacebridge_server_url = default_spacebridge_server

    return spacebridge_server_url

def get_current_spacebridge_server_bundle(log: logging.Logger, session_token: str) -> dict:
    try:
        kvstore_service = kvstore(collection=INSTANCE_CONFIG_COLLECTION_NAME,
                                  session_key=session_token)
        response, result = kvstore_service.get_item_by_key(SPACEBRIDGE_SERVER)
        result_json = json.loads(result)

        return result_json

    except splunk.RESTException as e:
        log.error("Unable to fetch current spacebridge bundle, error: {}".format(str(e)))

        return {STATUS: HTTPStatus.INTERNAL_SERVER_ERROR}

def get_spacebridge_response_times(config: SecureGatewayConfig, log: logging.Logger, spacebridge_instances):
    n_requests = 5
    if not spacebridge_instances:
        return {}

    # For each server, make multiple get requests and record response times
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        tasks = []
        for instance in spacebridge_instances:
            for _ in range(n_requests):
                tasks.append(executor.submit(get_spacebridge_response_time, config, log, instance.httpDomain))
        # As requests are completed, add results to list
        all_response_times = [task.result() for task in concurrent.futures.as_completed(tasks)]

    # Get average response times for each server
    avg_response_times = {}
    for server, response_times in groupby(all_response_times, key=itemgetter(SERVER)):
        # Get only non-null response times
        defined_response_times = [x[RT] for x in response_times if x[RT] != None]
        if len(defined_response_times):
            avg_response_times[server] = mean(defined_response_times)
        else:
            avg_response_times[server] = None

    return avg_response_times

def get_spacebridge_response_time(config: SecureGatewayConfig,log: logging.Logger, serverHttpDomain: str) -> dict:
    request_timeout = 3
    serverURL = f'https://{serverHttpDomain}/health_check'
    try:
        # Perform GET request to spacebridge server health endpoint
        response = requests.get(
            serverURL, proxies=config.get_proxies(), timeout=request_timeout)
        response_time = response.elapsed.total_seconds()

        # Raise exception for bad status codes
        response.raise_for_status()
    except requests.exceptions.HTTPError as err:
        log.info("Error reaching {}: {}".format(serverURL, err))
        response_time = None

    return {SERVER: serverHttpDomain, RT: response_time}
