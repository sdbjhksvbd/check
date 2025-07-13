"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Module providing client for making non-ssl asynchronous requests
"""
import logging

from cloudgateway.private.asyncio.clients.aio_client import AioHttpClient
from spacebridgeapp.rest.clients.async_client import AsyncClient
from spacebridgeapp.util.config import SecureGatewayConfig


class AsyncNonSslClient(AsyncClient):
    """
        Client for handling asynchronous requests to KV Store
        """

    def __init__(self, log: logging.Logger, config: SecureGatewayConfig):
        super(AsyncNonSslClient, self).__init__(log, config, client=AioHttpClient(verify_ssl=False))
