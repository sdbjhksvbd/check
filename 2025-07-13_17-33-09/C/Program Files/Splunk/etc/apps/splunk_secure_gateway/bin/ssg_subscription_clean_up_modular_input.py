"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Modular Input for deleting expired subscriptions
"""

import warnings
warnings.filterwarnings('ignore', '.*service_identity.*', UserWarning)

import sys
import os
from splunk.clilib.bundle_paths import make_splunkhome_path
from spacebridgeapp.util import py23

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'

from solnlib import modular_input
from spacebridgeapp.util.base_modular_input import BaseModularInput
from spacebridgeapp.util.splunk_utils.common import modular_input_should_run
from spacebridgeapp.util.constants import SPACEBRIDGE_APP_NAME
from spacebridgeapp.subscriptions.subscription_clean_up import SubscriptionCleanUp


class SubscriptionCleanUpModularInput(BaseModularInput):
    title = 'Splunk Secure Gateway Subscription Clean Up'
    description = 'Clean up expired subscriptions'
    app = 'Splunk Secure Gateway'
    name = 'splunk_secure_gateway'
    use_kvstore_checkpointer = False
    use_hec_event_writer = False
    input_config_key = "ssg_subscription_clean_up_modular_input://default"
    config_key_cleanup_threshold_seconds = "cleanup_threshold_seconds"
    log_mod_input_name = "ssg_subscription_clean_up_modular_input.app"
    run_on_captain_only = True        

    def extra_arguments(self):
        """
        Override extra_arguments list for modular_input scheme
        :return:
        """
        return [
            {
                'name': 'cleanup_threshold_seconds',
                'title': 'Cleanup Threshold in Seconds',
                'description': 'Grace period after which subscriptions and searches will be cleaned up',
                'data_type': modular_input.Argument.data_type_number
            }
        ]

    def do_run(self, input_config):
        """
        Executes the modular input
        :param input_config:
        :return:
        """
        if not super(SubscriptionCleanUpModularInput, self).do_run(input_config):
            return
        
        logger = self.logger
        logger.info("Running Subscription Clean Up modular input on search captain node")
        cleanup_time_seconds = input_config[self.input_config_key][self.config_key_cleanup_threshold_seconds]
        subscription_clean_up = SubscriptionCleanUp(logger, self.session_key, int(cleanup_time_seconds))

        try:
            subscription_clean_up.run()
        except:
            logger.exception("Failure encountered while running Subscription Clean Up")


if __name__ == "__main__":
    worker = SubscriptionCleanUpModularInput()
    worker.execute()
