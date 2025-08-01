"""Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved."""
import logging
from http import HTTPStatus
import asyncio
from spacebridgeapp.request.generic_request_processor import fetch_registered_apps
from spacebridgeapp.rest.clients.async_client_factory import AsyncClientFactory
from spacebridgeapp.rest.config.deployment_info import get_meta_info
from spacebridgeapp.rest.services.splunk_service import get_deployment_info
from spacebridgeapp.util import constants
from spacebridgeapp.util.asyncio import cancel_all_tasks
from spacebridgeapp.util.constants import VERSION
from spacebridgeapp.versioning import app_version, minimum_build
from splapp_protocol import request_pb2
from cloudgateway.splunk.asyncio.auth import SplunkAuthHeader
from spacebridgeapp.data.telemetry_data import InstallationEnvironment
from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeApiRequestError
from urllib.parse import urlparse


async def process_get_version_request(log: logging.Logger,
                                      request_context,
                                      client_single_request,
                                      server_single_response,
                                      async_client_factory: AsyncClientFactory):
    """
    Process getVersionRequest by returning splunk app version number, min supported client version and friendly name
    for device
    """
    log.debug("Processing get version")

    async_kvstore_client = async_client_factory.kvstore_client()
    async_telemetry_client = async_client_factory.telemetry_client()
    async_splunk_client = async_client_factory.splunk_client()

    server_single_response.versionGetResponse.SetInParent()
    server_single_response.versionGetResponse.cloudgatewayAppVersion = str(app_version())

    user_agent = request_context.user_agent or "invalid"
    agent_parts = user_agent.split('|')
    app_id = agent_parts[0]

    app_min_build = minimum_build(app_id)
    server_single_response.versionGetResponse.minimumClientVersion = str(app_min_build)

    auth_header = request_context.auth_header

    companion_app_list = await fetch_registered_apps(log, auth_header, async_splunk_client)
    for key, app in companion_app_list.items():
        companion = server_single_response.versionGetResponse.companionApps.add()
        companion.appId = key
        companion.appVersion = app[VERSION]

    device_name = await _get_device_name(log,
                                         auth_header, auth_header.username, request_context.device_id,
                                         async_kvstore_client, request_context)

    server_single_response.versionGetResponse.deviceName = device_name

    meta_info = await async_get_meta_info(log, auth_header, async_kvstore_client)

    deployment_friendly_name = meta_info[constants.DEPLOYMENT_INFO][constants.DEPLOYMENT_FRIENDLY_NAME]

    server_single_response.versionGetResponse.deploymentFriendlyName = deployment_friendly_name

    telemetry_instance_id = await async_telemetry_client.get_telemetry_instance_id(auth_header)
    server_single_response.versionGetResponse.instanceId = telemetry_instance_id

    installation_environment = await async_telemetry_client.get_installation_environment(auth_header)
    installation_environment_proto = request_pb2.VersionGetResponse.CLOUD \
        if installation_environment is InstallationEnvironment.CLOUD \
        else request_pb2.VersionGetResponse.ENTERPRISE
    server_single_response.versionGetResponse.installationEnvironment = installation_environment_proto

    splunk_version = await async_telemetry_client.get_splunk_version(auth_header)
    server_single_response.versionGetResponse.splunkVersion = splunk_version

    if installation_environment is InstallationEnvironment.CLOUD:
        stack_name = await fetch_stack_name(log, auth_header, async_splunk_client)
        server_single_response.versionGetResponse.cloudStackName = stack_name

    # Mdm Enforced
    mdm_configuration = meta_info.get(constants.ENFORCE_MDM, {})
    enform_mdm_meta_info = mdm_configuration.get(constants.ENFORCE_MDM, False)
    server_single_response.versionGetResponse.mdmEnforced = enform_mdm_meta_info

    log.debug("Finished processing get version")


async def _get_device_name(log: logging.Logger,
                           auth_header, user, device_id, async_kvstore_client, request_context):
    """
    Get friendly name for device given it's device id
    """

    response = await async_kvstore_client.async_kvstore_get_request(
        constants.REGISTERED_DEVICES_COLLECTION_NAME, auth_header=auth_header, owner=user)

    if response.code == HTTPStatus.OK:
        response_json = await response.json()

        for device in response_json:
            if device["device_id"] == device_id:
                return device.get("device_name", '')

    log.error("Unable to fetch friendly name for device={}, code={}".format(device_id, response.code))
    return ""


async def async_get_meta_info(log: logging.Logger,
                              auth_header, async_kvstore_client):
    """
    Fetch data from meta table in KV Store
    """

    response = await async_kvstore_client.async_kvstore_get_request(
        constants.META_COLLECTION_NAME,
        auth_header=auth_header,
        owner=constants.NOBODY)

    if response.code == HTTPStatus.OK:
        response_json = await response.json()
        meta_info = {item['_key']: item for item in response_json}
        return meta_info

    log.error("Unable to fetch meta info for instance, code={}".format(response.code))
    return {}


async def fetch_stack_name(log: logging.Logger, auth_header, async_splunk_client):
    """
    Fetch server information from the server info endpoint to get serverName and return only the stack name for
    Splunk cloud instances. This method is intended to be used only on splunkcloud instances.
    """
    response = await async_splunk_client.async_get_server_info(auth_header)

    if not response.code == HTTPStatus.OK:
        raise SpacebridgeApiRequestError(
            "Error fetching server info from with code={}".format(response.code), status_code=response.code)

    jsn = await response.json()
    parsed_server_name = urlparse(jsn[constants.ENTRY][0][constants.CONTENT][constants.SERVER_NAME])
    server_uri = parsed_server_name.path

    try:
        """
        Server name in splunk cloud stacks is going to have the search head id in the first split
        followed by the stack name. This split should return only the stack name
        """
        stack_name = server_uri.split('.')[1]
        return stack_name
    except Exception as e:
        log.debug("Could not extract stack name from the URL {}".format(e))

    return ""


async def build_version_get_response(log: logging.Logger,
                                     session_token,
                                     app_id,
                                     device_name,
                                     async_client_factory,
                                     registration_info=None):
    """
    Build version get response object
    """
    if registration_info is None:
        registration_info = {}

    splapp_meta = get_deployment_info(log, session_token)
    auth_header = SplunkAuthHeader(session_token)

    version_get_response = request_pb2.VersionGetResponse()

    # Deployment Friendly Name
    version_get_response.deploymentFriendlyName = splapp_meta['friendly_name']

    # SSG version and min client version
    version_get_response.cloudgatewayAppVersion = str(app_version())
    version_get_response.minimumClientVersion = str(minimum_build(app_id))

    # Device name
    version_get_response.deviceName = device_name

    # Companion Apps
    companion_app_list = await fetch_registered_apps(log, auth_header, async_client_factory.splunk_client())

    for key, app in companion_app_list.items():
        companion = version_get_response.companionApps.add()
        companion.appId = key
        companion.appVersion = app[constants.VERSION]

    # Splunk Version
    splunk_version = await async_client_factory.telemetry_client().get_splunk_version(auth_header)
    version_get_response.splunkVersion = splunk_version

    # Telemetry Instance Id
    telemetry_instance_id = await async_client_factory.telemetry_client().get_telemetry_instance_id(auth_header)
    version_get_response.instanceId = telemetry_instance_id

    # Installation Environment
    installation_environment = await async_client_factory.telemetry_client().get_installation_environment(auth_header)

    installation_environment_proto = request_pb2.VersionGetResponse.CLOUD \
        if installation_environment is InstallationEnvironment.CLOUD \
        else request_pb2.VersionGetResponse.ENTERPRISE
    version_get_response.installationEnvironment = installation_environment_proto

    # Mdm Enforced
    version_get_response.mdmEnforced = get_meta_info(log,
                                                     session_token,
                                                     constants.ENFORCE_MDM).get(constants.ENFORCE_MDM, False)

    # Registration Type
    registration_type_proto = registration_info.get(constants.REGISTRATION_TYPE, None)
    if registration_type_proto:
        version_get_response.registrationType = registration_type_proto

    # Registration Method
    registration_method_proto = registration_info.get(constants.REGISTRATION_METHOD, None)
    if registration_method_proto:
        version_get_response.registrationMethod = registration_method_proto

    log.info("complete building metainfo version_get_response={}".format(version_get_response))
    return version_get_response


def version_get_response_sync_adapter(log: logging.Logger,
                                      session_token,
                                      app_id,
                                      device_name,
                                      async_client_factory,
                                      registration_info=None):
    """
    Adapter for running build_version_get_response by first checking for/creating an event loop.
    """

    try:
        loop = asyncio.get_running_loop()
    except Exception as e:
        log.debug(f"Unable to get event loop, error={e}. Creating a new loop.")
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    finally:
        return loop.run_until_complete(build_version_get_response(log,
                                                                  session_token=session_token,
                                                                  app_id=app_id,
                                                                  device_name=device_name,
                                                                  async_client_factory=async_client_factory,
                                                                  registration_info=registration_info))
