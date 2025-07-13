"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for setting Spacebridge server that will also unregister all devices in KVStore Instance config
"""
import sys
import json
import os
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'

import splunk
from splunk.clilib.bundle_paths import make_splunkhome_path

sys.path.append(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.append(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from http import HTTPStatus
from spacebridgeapp.rest.base_endpoint import BaseRestHandler
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject as kvstore
from spacebridgeapp.util.constants import SPACEBRIDGE_SERVER, MESSAGE, HTTP_DOMAIN, \
    PAYLOAD, STATUS, INSTANCE_CONFIG_COLLECTION_NAME, KEY, SESSION, USER, SYSTEM_AUTHTOKEN, AUTHTOKEN, CODE, RESULT
from cloudgateway.private.sodium_client import SodiumClient
from splunk.persistconn.application import PersistentServerConnectionApplication
from spacebridgeapp.rest.services.device_service import delete_all_devices
from spacebridgeapp.util.config import get_spacebridge_instance_info_json

class SetSpacebridgeServer(BaseRestHandler, PersistentServerConnectionApplication):
    """
    Main class for deleting existing devices and updating the spacebridge_server in Kvstore.
    BaseRestHandler.

    """

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="rest_set_spacebridge_server")
        self.sodium_client = SodiumClient()

    def post(self, request):
        user = request[SESSION][USER]
        session_token = request[SESSION][AUTHTOKEN]
        system_authtoken = request[SYSTEM_AUTHTOKEN]

        body = json.loads(request[PAYLOAD])
        kvstore_service = kvstore(collection=INSTANCE_CONFIG_COLLECTION_NAME, session_key=system_authtoken)

        if not body:
            error = "Empty request body is not accepted. Please populate request body."
            self.log.error(error)
            return build_error_response(error, HTTPStatus.BAD_REQUEST)

        # Sanity check on data sent
        if not SPACEBRIDGE_SERVER in body:
            error = f"Failed to set Spacebridge Server expecting key = spacebridge_server"
            self.log.error(error)
            return build_error_response(error, HTTPStatus.BAD_REQUEST)

        value = body[SPACEBRIDGE_SERVER]

        if not isinstance(value, dict):
            error = f"Failed to set Spacebridge Server, unexpected type of data {type(value)}"
            self.log.error(error)
            return build_error_response(error, HTTPStatus.BAD_REQUEST)

        # Validate that we're not trying to change to the same Spacebridge server that we're already on
        if self.config.get_spacebridge_server() == value[HTTP_DOMAIN]:
            return {
                PAYLOAD: {
                    MESSAGE: "Spacebridge already set to this server. No devices deleted.",
                    RESULT: json.dumps([])
                },
                STATUS: HTTPStatus.OK
            }

        value[KEY] = SPACEBRIDGE_SERVER

        # Attempt to delete devices before changing Spacebridge server
        # If all devices are unable to be deleted catch error and halt changing server
        # If some devices are deleted continue to change Spacebridge server and report the failed devices
        self.log.debug("Attempting to delete all devices.")

        try:
            deletion_result = delete_all_devices(self.log, user, session_token, system_authtoken)

            successful_deletions = []
            failed_deletions = []

            for result in deletion_result:
                if result[CODE] == HTTPStatus.OK:
                    successful_deletions.append(result)
                else:
                    failed_deletions.append(result)

            num_success = len(successful_deletions)
            num_failed = len(failed_deletions)

            # Only do this check if deletion_result is non zero, to avoid the case of no registered devices
            if deletion_result and num_failed == len(deletion_result):
                error = "All device deletions failed. Aborting changing Spacebridge Server."
                self.log.warn(error)
                return build_error_response(error, HTTPStatus.INTERNAL_SERVER_ERROR)

        except Exception as e:
            error = f"An error occurred while deleting all devices, error = {str(e)}. " \
                    f"Aborting changing Spacebridge Server."

            self.log.warn(error)
            return build_error_response(error, HTTPStatus.INTERNAL_SERVER_ERROR)

        self.log.info("Delete devices completed. Deletions_succeeded = %s, Deletions_failed = %s" %
                    (num_success, num_failed))

        # Deletion completed, attempt to modify Spacebridge server
        try:
            self.log.debug("Attempting to update spacebridge_server in instance config")
            kv_json = get_spacebridge_instance_info_json(session_token, self.config, value[HTTP_DOMAIN], sodium_client=self.sodium_client) or value
            kvstore_service.insert_or_update_item_containing_key(kv_json)
            kvstore_service.insert_or_update_item_containing_key(self.config.update_timestamp_json())

            self.log.info(f"[spacebridge_server updated] Successfully changed to {value[HTTP_DOMAIN]} by {user}")
        except splunk.RESTException as e:
            error = f"Failed to change Spacebridge server, after deleting devices. " \
                    f"Error = {str(e)}, Deleted devices = {deletion_result}"
            self.log.warn(error)
            return build_error_response(error, HTTPStatus.INTERNAL_SERVER_ERROR)

        return {
            PAYLOAD: {
                MESSAGE: "Spacebridge server update complete. Successful deletions = %s, Failed deletions = %s" % (
                    num_success, num_failed),
                RESULT: json.dumps(deletion_result)},
            STATUS: HTTPStatus.OK
        }


def build_error_response(message, status):
    return {
        PAYLOAD: {MESSAGE: message},
        STATUS: status,
    }
