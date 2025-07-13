"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Base class for all modular_inputs in this app.  All new modular_inputs should extend off this.
"""
import logging
import sys
from abc import abstractmethod
from solnlib import modular_input
from spacebridgeapp.util.splunk_utils.common import modular_input_should_run
from spacebridgeapp.rest.services.splunk_service import get_cluster_mode, get_server_roles
from spacebridgeapp.util.config import load_config
from spacebridgeapp.logging import setup_logging
from spacebridgeapp.util import constants

import time

SERVER_CHECK_TIMEOUT = 600
SERVER_CHECK_INTERVAL = 30
KV_STORE = 'kv_store'
DISABLED = 'disabled'
SEARCHHEAD = 'searchhead'
ACCEPTED_CLUSTER_MODES = [DISABLED, SEARCHHEAD]
LOG_DEFAULT_FMT = '%(levelname)s [%(name)s:%(lineno)d] [%(funcName)s] [%(process)d] %(message)s'


def fallback_logger(mod_input_name, level=logging.INFO):
    logging.addLevelName(logging.INFO, 'INFO')
    handler = logging.StreamHandler(sys.stderr)
    formatter = logging.Formatter(LOG_DEFAULT_FMT)
    handler.setFormatter(formatter)
    logger = logging.getLogger(mod_input_name)
    logger.setLevel(level)
    logger.addHandler(handler)

    return logger


class BaseModularInput(modular_input.ModularInput):
    log_mod_input_name = "ssg_modular_input.app"
    log_filename = f"{constants.SPACEBRIDGE_APP_NAME}_modular_input.log"
    config = None
    logger = None
    run_on_captain_only = False

    def _should_modular_input_run(self):
        try:
            server_roles = get_server_roles(self.session_key)
            cluster_mode = get_cluster_mode(self.session_key)
            return cluster_mode in ACCEPTED_CLUSTER_MODES and KV_STORE in server_roles
        except Exception:
            # Fail closed
            return False

    @abstractmethod
    def do_run(self, inputs):
        count = 0
        while not self._should_modular_input_run():
            count += SERVER_CHECK_INTERVAL
            time.sleep(SERVER_CHECK_INTERVAL)
            if count >= SERVER_CHECK_TIMEOUT:
                return False
            
        self.config = load_config(self.session_key)
        self.logger = self.setup_logging(self.config)
        
        if self.config is None or self.logger is None:
            return False
        
        if self.run_on_captain_only:
            return modular_input_should_run(self.session_key, self.logger)

        return True

    def setup_logging(self, config):
        try:
            return setup_logging(self.log_filename, self.log_mod_input_name, config=config)
        except Exception:
            logger = fallback_logger(self.log_mod_input_name)
            logger.info(f'{self.log_filename} could not be created, will attempt to reinitialize in the next run of {self.log_mod_input_name}')
            return None
