"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for accessing and setting instance setting kvstore records
"""
import sys
import json
from splunk.clilib.bundle_paths import make_splunkhome_path

sys.path.append(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.append(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from http import HTTPStatus
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject as kvstore
from spacebridgeapp.util.constants import PAYLOAD, INSTANCE_CONFIG_COLLECTION_NAME, KEY, VALUE, SYSTEM_AUTHTOKEN, DEPLOYMENT_NAME, \
                                            SPACEBRIDGE_SERVER, SESSION, USER, AUTHTOKEN, CODE
from spacebridgeapp.rest.config.deployment_info import get_deployment_friendly_name, set_deployment_friendly_name
from spacebridgeapp.util.config import SecureGatewayConfig, ConfigType
from spacebridgeapp.util.config import load_config as load_config_from_kvstore
from spacebridgeapp.rest.services.device_service import delete_all_devices
from spacebridgeapp.util.config import get_spacebridge_instance_info_json
from spacebridgeapp.rest.config.deployment_name import validate_deployment_name

QUERY_LABEL = 'query'
CONFIG_KEYS_LABEL = 'config_key'
SHOW_HIDDEN_LABEL = 'show_hidden'
KEY_LABEL = 'key'

def load_config(log, config: SecureGatewayConfig, request):
    query_params = request.get(QUERY_LABEL)
    config_key = None
    show_hidden = False

    if query_params:
        config_key = query_params.get(CONFIG_KEYS_LABEL)
        show_hidden = (query_params.get(SHOW_HIDDEN_LABEL) == "1")

    config = load_config_from_kvstore(request[SYSTEM_AUTHTOKEN], force_refresh=True)
    config_list = config.to_json(show_hidden=show_hidden)
    prepend_deployment_info(log, request, config, config_list)

    if config_key:
        for single_config in config_list:
            if single_config[KEY] == config_key:
                instance_config_setting = single_config
                instance_config_setting[KEY_LABEL] = instance_config_setting[KEY]
                return [instance_config_setting]
        
        return []
    else:
        for item in config_list:
            item[KEY_LABEL] = item[KEY]

        log.info("returning instance config")
        return config_list

def prepend_deployment_info(log, request, config: SecureGatewayConfig, config_list):
    deployment_name = get_deployment_friendly_name(log, request[SYSTEM_AUTHTOKEN], False)
    config_list.insert(0, {KEY: DEPLOYMENT_NAME, VALUE: deployment_name, config.TEMPLATE.ConfigDefinition.TYPE_LABEL: ConfigType.STRING.value, config.TEMPLATE.ConfigDefinition.EXPERT_ONLY_LABEL: False, config.TEMPLATE.ConfigDefinition.ALLOW_RESET_LABEL: False })     

def update_config(log, request, current_config):
    user = request[SESSION][USER]
    session_token = request[SESSION][AUTHTOKEN]
    system_authtoken = request[SYSTEM_AUTHTOKEN]
    current_config = load_config_from_kvstore(system_authtoken, force_refresh=True)


    body = json.loads(request[PAYLOAD]) if PAYLOAD in request else None
    if not body:
        return (False, "Empty request body is not accepted. Please populate request body.")
    
    if not isinstance(body, list):
        return (False, "Request body must be a list.")

    if len(body) > 0:
        body.insert(0, current_config.update_timestamp_json())

    kvstore_service = kvstore(collection=INSTANCE_CONFIG_COLLECTION_NAME, session_key=system_authtoken)
    config_updated = []
    errors = []

    try:
        for config_item in body:
            if KEY not in config_item:
                return (False, f"Failed to set instance config settings, {KEY} missing, config_item: {config_item}")

            if VALUE not in config_item:
                return (False, f"Failed to set instance config settings, {VALUE} missing")                
            
            kv_config_item = {KEY: config_item[KEY], VALUE: config_item[VALUE]}

            if config_item[KEY] == SPACEBRIDGE_SERVER:
                success, result = _handle_spacebridge_server(log, config_item, current_config, user, session_token, system_authtoken)
                if success:
                    kv_config_item = result
                else:
                    errors.append(result)
                    continue

            if config_item[KEY] == DEPLOYMENT_NAME:
                success, error = _handle_deployment_name(system_authtoken, config_item[VALUE])
                if not success:
                    errors.append(error)
            else:
                kvstore_service.insert_or_update_item_containing_key(kv_config_item)

            if config_item[KEY] == SPACEBRIDGE_SERVER:
                log.info(f"[spacebridge_server updated] Successfully changed to {config_item[VALUE]} by {user}")

            config_updated.append(kv_config_item[KEY])
    except Exception as e:
        log.error("Failed to set instance config settings. error=%s", e)
        return (False, e)
    
    updated_keys = ','.join(config_updated)
    error_string = "\n\t".join(errors)
    message = f"Updated {len(config_updated)} configs.\nUpdated keys: {updated_keys}.\nErrors: {error_string}"
    update_successful = True if len(body) == 0 or len(config_updated) > 0 else False

    return (update_successful, message)

def _handle_spacebridge_server(log, config_item, current_config: SecureGatewayConfig, user, session_token, system_authtoken):
    spacebridge_server = config_item[VALUE]
    if spacebridge_server == current_config.get_spacebridge_server():
        return (False, "Spacebridge already set to this server. No devices deleted.")
    
    # Attempt to delete devices before changing Spacebridge server
    try:
        deletion_result = delete_all_devices(log, user, session_token, system_authtoken)
        successful_deletions = [result for result in deletion_result if result[CODE] == HTTPStatus.OK]
        num_results = len(deletion_result)
        num_deletions = len(successful_deletions)
        num_failures = num_results - num_deletions
        if num_failures > 0:
            if num_deletions == 0:
                error = "All device deletions failed. Aborting changing Spacebridge Server."
                log.warn(error)
                return (False, error)
            else:
                log.warn("Failed to delete {num_failures} devices.")
    except Exception as e:
        error = f"An error occurred while deleting all devices. Error: {str(e)}"
        log.warn(error)
        return (False, error)

    # Enhance config item with additonal info if it is a public spacebridge
    return (True, get_spacebridge_instance_info_json(session_token, current_config, spacebridge_server) or config_item)

def _handle_deployment_name(auth_token, deployment_name):
    if not validate_deployment_name(deployment_name):
        return (False, "Invalid deployment name")
    set_deployment_friendly_name(auth_token, deployment_name)
    return (True, None)

def delete_config(log, request, config: SecureGatewayConfig):
    body = json.loads(request[PAYLOAD])
    config_key = body[KEY_LABEL]
    kvstore_service = kvstore(collection=INSTANCE_CONFIG_COLLECTION_NAME, session_key=request[SYSTEM_AUTHTOKEN])
    try:
        response = kvstore_service.delete_item_by_key(config_key)
        kvstore_service.update_item_by_key(config.UPDATE_TIMESTAMP_KEY, config.update_timestamp_json())
        return {True, f"Config key {config_key} deleted {response}"}

    except Exception as e:
        log.warn("Failed to delete instance config key %s. error=%s", config_key, e)
        return (False, e)        