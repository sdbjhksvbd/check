"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for accessing and setting instance setting kvstore records
"""
import sys
from splunk.clilib.bundle_paths import make_splunkhome_path
import os
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'

sys.path.append(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.append(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from http import HTTPStatus
from spacebridgeapp.rest.base_endpoint import BaseRestHandler
from spacebridgeapp.util.constants import PAYLOAD, STATUS
from spacebridgeapp.rest.config.instance_config_helper import load_config
from splunk.persistconn.application import PersistentServerConnectionApplication

class GetInstanceConfig(BaseRestHandler, PersistentServerConnectionApplication):
    """
    Main class for handling the instance config endpoint. Subclasses the spacebridge_app
    BaseRestHandler.

    """

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="get_rest_instance_config")

    def get(self, request):
        self.log.info("Getting instance config")
        instance_config_settings = load_config(self.log, self.config, request)
        return {
            PAYLOAD: instance_config_settings,
            STATUS: HTTPStatus.OK
        }
