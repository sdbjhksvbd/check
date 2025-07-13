"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for managing notification subscription for scheduled report
"""
import os

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'

from re import S
import sys
import logging
from dataclasses import dataclass, fields
from splunk.persistconn.application import PersistentServerConnectionApplication
from splunk.clilib.bundle_paths import make_splunkhome_path

sys.path.append(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.append(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
from spacebridgeapp.rest.base_endpoint import BaseRestHandler
from spacebridgeapp.rest.util.helper import enforce_required_parameters
from spacebridgeapp.reports.report_helper import ParsedReportId
from spacebridgeapp.rest.services.splunk_service import get_saved_search, persist_saved_search
from spacebridgeapp.alerts.alert_action import MobileAlertAction
from spacebridgeapp.rest.util.utils import SplunkRequest


@dataclass(frozen=True)
class ReportSubscribeRequest:
    """Data class for managing notification subscription request for reports"""
    id: str


class ReportNotificationSubscribeHandler(BaseRestHandler, PersistentServerConnectionApplication):

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="report_notification_subscribe")

    def post(self, request):
        """ allow a user to subscribe to receive notifications from scheduled report """
        self.log.info('Received report notification subscribe request')
        splunk_request = SplunkRequest.from_request(request)
        enforce_required_parameters([field.name for field in fields(ReportSubscribeRequest)], splunk_request.body)
        report_subscribe_request = ReportSubscribeRequest(splunk_request.body['id'])
        self.log.debug(f"Successfully parsed report_subscribe_request={report_subscribe_request}")
        parsed_report_id = ParsedReportId(report_subscribe_request.id)

        status = subscribe_user_to_report(log=self.log,
                                          user_session_token=splunk_request.user_session_token,
                                          system_session_token=splunk_request.system_session_token,
                                          user=splunk_request.user,
                                          owner=parsed_report_id.user,
                                          app_name=parsed_report_id.app_name,
                                          report_name=parsed_report_id.report_name)

        self.log.info(f"Completed report notification subscription request with status={status}")

        return {
            'status': status
        }


def subscribe_user_to_report(log: logging.Logger, user_session_token: str, system_session_token: str, user: str,
                             owner: str,
                             app_name: str, report_name: str):
    response = get_saved_search(user_session_token, user, app_name, report_name)
    log.info("Successfully fetched saved_search")
    alert_action = MobileAlertAction.parse_saved_search_response(response)
    alert_action.add_user(user)
    log.info(f"Recipient_users = {alert_action.to_saved_search_format()} ")

    status = persist_saved_search(
        system_session_token,
        owner,
        app_name,
        report_name,
        alert_action.to_saved_search_format())

    return status
