# Suppress warnings to pass AppInspect when calling --scheme
import warnings
import os

from spacebridgeapp.util import py23

py23.suppress_insecure_https_warnings()
warnings.filterwarnings('ignore', '.*service_identity.*', UserWarning)

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'

import json

from spacebridgeapp.util.base_modular_input import BaseModularInput
from spacebridgeapp.util import constants
from spacebridgeapp.util.splunk_utils.common import modular_input_should_run
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject as kvstore
from spacebridgeapp.util.config import LegacySecureGatewayConfig, SecureGatewayConfig, get_spacebridge_instance_info_json
from splunk import RESTException
from http import HTTPStatus

MIGRATION_COMPLETED_SETTING = 'conf_migration_completed'
class ConfigModularInput(BaseModularInput):
    title = 'Config Modular Input'
    description = 'Migrates configuration from conf file to KV store'
    app = 'Config Modular Input'
    name = 'config'
    use_kvstore_checkpointer = False
    use_hec_event_writer = False
    spacebridge_server_conf_path = "securegateway/setup/spacebridge_server"
    input_name = 'ssg_config_modular_input'
    log_mod_input_name = f"{input_name}.app"
    run_on_captain_only = True    

    def do_run(self, input_config):
        if not super(ConfigModularInput, self).do_run(input_config):
            return

        config, logger = self.config, self.logger

        # Config migration should only run once
        logger.debug('Check if migration has been completed')
        kvstore_service = kvstore(collection=constants.INSTANCE_CONFIG_COLLECTION_NAME,
                                  session_key=self.session_key)

        try:
            _, result = kvstore_service.get_item_by_key(MIGRATION_COMPLETED_SETTING)
            parsed = json.loads(result)
            flag = parsed.get(constants.VALUE)
            if flag == True:
                logger.debug("Migration already ran. Terminating....")
                return
        except RESTException as e:
            if e.statusCode == HTTPStatus.NOT_FOUND:
                logger.debug("Migration flag not found in KV store, proceed with migration.")
            else:
                logger.exception(f"Error retrieving migration flag - {str(e)}")
                return


        # Migration begin
        logger.debug('Start migration')

        conf_config = LegacySecureGatewayConfig()
        kv_update_json = conf_config.get_kv_json()

        if len(kv_update_json) > 0:
            logger.info(f"Found {len(kv_update_json)} settings to migrate")
            kv_update_json.append({constants.KEY: MIGRATION_COMPLETED_SETTING, constants.VALUE: True})
            kv_update_json.append(SecureGatewayConfig.update_timestamp_json())
            #Backfill spacebridge info
            spacebridge_server_json = get_spacebridge_instance_info_json(self.session_key, config, config.get_spacebridge_server())
            if spacebridge_server_json is not None:
                kv_update_json.append(spacebridge_server_json)
            try:
                kvstore_service.insert_multiple_items(kv_update_json)
            except Exception as e:
                logger.exception(f"Error saving configuration. Error: {str(e)}")
                return

        logger.info('Migration successful')


if __name__ == "__main__":
    worker = ConfigModularInput()
    worker.execute()
