"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Methods for sending latency metrics to telemetry
"""
import logging


async def send_dashboard_list_request_metrics_to_telemetry(log: logging.Logger,
                                                           message_type,
                                                           latency,
                                                           request_context,
                                                           async_telemetry_client,
                                                           useragent=None):
    """
    Take a message type string and useragent string and log that information to telemetry
    :param log:
    :param message_type: String (e.g. DASHBOARD_LIST_REQUEST)
    :param latency: time taken to execute request
    :param request_context:
    :param async_telemetry_client:
    :param useragent: String representing the user's device meta information
    :return:
    """
    payload = {
        "messageType": message_type,
        "latency": latency,
        "deviceId": request_context.device_id,
        "useragent": useragent
    }

    await async_telemetry_client.post_metrics(log, payload, request_context.system_auth_header)
