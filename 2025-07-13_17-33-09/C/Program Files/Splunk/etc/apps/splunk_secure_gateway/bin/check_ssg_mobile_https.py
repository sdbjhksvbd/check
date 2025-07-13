#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved."""

# Splunk specific dependencies
import sys, os
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'

from splunk.clilib.bundle_paths import make_splunkhome_path
from spacebridgeapp.util import py23


from requests.exceptions import ProxyError
from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option, validators
from spacebridgeapp.util.config import load_config

# Command specific dependencies
import requests


@Configuration(type='reporting')
class SecureGatewayHttpsCheck(GeneratingCommand):
    """
    This command checks spacebridge reachability by using requests to make an http call to the health check endpoint.
    Any http return other than 200 is considered a failure.  By default it will inherit Splunk's proxy settings and use
    them.  In the command you can disable the proxy by passing useProxy=False.
    """
    useProxy = Option(require=False, validate=validators.Boolean(), default=True)

    def generate(self):
        config = load_config(self._metadata.searchinfo.session_key)
        spacebridge_server = config.get_spacebridge_domain()

        url = "{}/health_check".format(spacebridge_server)

        proxies = config.get_proxies()

        # Unset proxy, if unsetProxy = True
        if not self.useProxy:
            proxies = {}

        # Load data from REST API
        try:
            response = requests.get(
                url,
                proxies=proxies,
                timeout=15
            )

            response.raise_for_status()
            healthy = {'https_sync': True}

        except requests.exceptions.HTTPError as err:
            healthy = {'https_sync': False, 'message': str(err)}
        except ProxyError as err:
            healthy = {'https_sync': False, 'message': str(err)}
        except requests.ConnectionError as err:
            healthy = {'https_sync': False, 'message': str(err)}

        yield healthy

    ''' HELPERS '''


dispatch(SecureGatewayHttpsCheck, sys.argv, sys.stdin, sys.stdout, __name__)
