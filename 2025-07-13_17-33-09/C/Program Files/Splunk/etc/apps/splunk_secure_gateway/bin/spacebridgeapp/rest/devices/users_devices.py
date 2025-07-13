"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.
"""
import os
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'

import logging
import sys
from functools import reduce

from splunk.clilib.bundle_paths import make_splunkhome_path
from splunk.persistconn.application import PersistentServerConnectionApplication

sys.path.append(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.append(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from spacebridgeapp.rest.devices.util import augment_device_with_metadata
from spacebridgeapp.rest.base_endpoint import BaseRestHandler
from spacebridgeapp.rest.services.splunk_service import get_all_mobile_users, get_all_users, \
    get_devices_for_user, get_devices_metadata, user_is_administrator


class DevicesForUser(BaseRestHandler, PersistentServerConnectionApplication):
    """
    Main class for handling the devices_user endpoint. Subclasses the spacebridge_app
    BaseRestHandler.
    """

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="rest_users_devices")

    def get(self, request):
        """
        Handler which retrieves all devices in the kvstore belonging to all users.
        """
        # Retrieves all devices from that user's devices kvstore collection
        self.log.info('Getting devices in kvstore belonging to all users for user=%s' % request['session']['user'])
        authtoken = request['session']['authtoken']
        all_devices = get_devices_for_registered_users(self.log, authtoken)
        devices_meta = get_devices_metadata(self.log, authtoken)
        augment_device_with_metadata(all_devices, devices_meta)

        return {
            'payload': all_devices,
            'status': 200
        }



def get_devices_for_registered_users(log: logging.Logger, authtoken):
    """
    This function gets all devices from the kvstore owned by all users (or the users viewable
    using the supplied authorization token). This function:
        1. Generates a list of Splunk users
        2. Retrieves lists of all devices from each user's devices kvstore collection and concatenates them together

    :param authtoken: Authorization token to supply to the kvstore interface
    :return: List of devices
    """

    # This branching logic is necessary as a work around to an issue with the /authentication/users endpoint in Core
    # The bug blocks inherited admins are not able to view other admins,
    # which is an issue on cloud instances because of sc_admins
    users = [user for user in get_all_mobile_users(authtoken)]

    if not user_is_administrator(authtoken):
        users = [user for user in users if user in get_all_users(authtoken)]

    devices = reduce(lambda acc, user: acc + get_devices_for_user(log, user, authtoken), users, [])
    return devices
