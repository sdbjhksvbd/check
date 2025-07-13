"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for setting the Device Name
"""
import os
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
import logging
import sys
import json
from splunk.clilib.bundle_paths import make_splunkhome_path

sys.path.append(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.append(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from spacebridgeapp.util import py23

from http import HTTPStatus
from spacebridgeapp.rest.base_endpoint import BaseRestHandler
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject as kvstore
from spacebridgeapp.util.constants import SESSION, AUTHTOKEN, \
    PAYLOAD, STATUS, KEY, SYSTEM_AUTHTOKEN, REGISTERED_DEVICES_COLLECTION_NAME, \
    DEVICE_NAME, OWNER
import splunk
from cloudgateway.private.sodium_client import SodiumClient
from splunk.persistconn.application import PersistentServerConnectionApplication
from spacebridgeapp.rest.registration.util import is_valid_session_token
from spacebridgeapp.rest.services.splunk_service import user_is_administrator

class SetDeviceNameHandler(BaseRestHandler, PersistentServerConnectionApplication):
    """
    Main class for setting the instance config endpoint. Subclasses the spacebridge_app
    BaseRestHandler.

    """

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="rest_set_device_name")
        self.sodium_client = SodiumClient()

    def post(self, request):
        body = json.loads(request[PAYLOAD])
        session_token = request[SESSION][AUTHTOKEN]
        system_authtoken = request[SYSTEM_AUTHTOKEN]
        device_key = body[KEY]
        device_owner = body[OWNER]
        device_name = body[DEVICE_NAME]
        return handle_set_device_name(self.log, device_owner, session_token, system_authtoken, device_key, device_name)

def handle_set_device_name(log: logging.Logger, owner, session_token, system_auth_token, device_key, device_name):
    try:
        if not user_is_administrator(session_token) and not is_valid_session_token(owner, session_token):
            return {
                PAYLOAD: {'message': 'User does not have permission to change device belonging to %s'.format(owner)},
                STATUS: HTTPStatus.FORBIDDEN,
            }
    except splunk.RESTException as e:
        status = HTTPStatus.INTERNAL_SERVER_ERROR
        log.warning("Failed to verify user. error=%s", e)
        return {
            PAYLOAD: {'message': e},
            STATUS: status,
        }

    kvstore_service = kvstore(collection=REGISTERED_DEVICES_COLLECTION_NAME, session_key=system_auth_token,
                              owner=owner)
    try:
        log.info(device_key)
        r, device = kvstore_service.get_item_by_key(key=device_key)
    except splunk.RESTException as e:
        status = HTTPStatus.INTERNAL_SERVER_ERROR
        log.warning("Failed to get device from kvstore. error=%s", e)
        return {
            PAYLOAD: {'message': e},
            STATUS: status,
        }

    new_device_name = device_name
    device = json.loads(device.decode('utf8'))
    device[DEVICE_NAME] = new_device_name

    try:
        kvstore_service.insert_or_update_item_containing_key(device)
        log.debug("Set device name to %s", new_device_name)
        return {
            STATUS: HTTPStatus.OK
        }
    except splunk.RESTException as e:
        status = HTTPStatus.INTERNAL_SERVER_ERROR
        log.warning("Failed to set device name. error=%s", e)
        return {
            PAYLOAD: {'message': e},
            STATUS: status,
        }
