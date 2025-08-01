"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.
"""
import logging

import splunk
import time

from http import HTTPStatus
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject as KvStore
from spacebridgeapp.util import constants
from spacebridgeapp.util.constants import REGISTERED_DEVICES_META_COLLECTION_NAME
from spacebridgeapp.rest.services.splunk_service import get_devices_metadata, \
    get_all_mobile_users, get_devices_for_user


class RegisteredDevicesCleanup(object):

    def __init__(self, log: logging.Logger, session_key):
        """
        Registered Devices Cleanup constructor
        :param session_key: session key passed by modular input
        """
        self.session_key = session_key
        self.log = log

    def run(self):
        """
        Attempts to sync the Registered Devices Metadata collection with Registered Devices.
        If the kvstore is not yet available, schedules a non-blocking retry attempt in 5 seconds
        """
        self.log.debug("Attempting Registered Devices Cleanup")
        try:
            self.sync()
        except splunk.RESTException as e:
            if e.statusCode == HTTPStatus.SERVICE_UNAVAILABLE:
                self.log.info(f"KVStore is unavailable with status = {e.statusCode}, SSG registered_devices_cleanup "
                               f"shutting down and retrying later.")
            else:
                raise e

    def sync(self):
        """
        Gets all keys in the KV Store Registered Devices collection, and delete the entries in
        the Registered Devices Meta collection that do not correspond to a valid device key.
        :return:
        """
        # Get existing metadata first to avoid race condition
        old_metadata = get_devices_metadata(self.log, self.session_key)
        old_metadata_keys = {entry[constants.KEY] for entry in old_metadata}

        # Get keys of all registered devices
        users = get_all_mobile_users(self.session_key)
        registered_devices = set()
        for user in users:
            devices = get_devices_for_user(self.log, user, self.session_key)
            device_keys = {device[constants.KEY] for device in devices}
            registered_devices.update(device_keys)

        # Delete the entries in meta collection that don't correspond to registered devices
        kvstore_registered_devices_meta = KvStore(REGISTERED_DEVICES_META_COLLECTION_NAME, self.session_key)
        try:
            [kvstore_registered_devices_meta.delete_item_by_key(key) for key in old_metadata_keys if
             key not in registered_devices]
            self.log.debug("Completed Registered Devices Cleanup")
        except:
            self.log.warning(
                f"Exception performing Registered Devices Cleanup for collection={REGISTERED_DEVICES_META_COLLECTION_NAME}")
