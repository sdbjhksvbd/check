"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Module for reports helper function
"""
from __future__ import annotations

import re
import urllib.parse as urllib
import hashlib
import datetime
import pytz
from splunk.util import localTZ

REPORT_ID_URL_REGEX = r'^https?://.+/servicesNS/(?P<user>[a-zA-Z0-9-_.%]+)/' \
                      r'(?P<app_name>[a-zA-Z0-9-_.%]+)/saved/searches/(?P<report_name>[a-zA-Z0-9-_.%]+)$'
REPORT_ID_URL_MATCHER = re.compile(REPORT_ID_URL_REGEX)
FIELD_REGEX = r'[a-zA-Z0-9-_.%]+'
FIELD_MATCHER = re.compile(FIELD_REGEX)
NEXT_SCHEDULED_TIME_REGEX = r'\d{4}-\d{2}-\d{2}\s+(?:\d{2}:){2}\d{2}'
NEXT_SCHEDULED_TIME_MATCHER = re.compile(NEXT_SCHEDULED_TIME_REGEX)
NEXT_SCHEDULED_DATETIME_FORMAT = '%Y-%m-%d %H:%M:%S'


class ParsedReportId:
    """
    Helper to parse a report_id either a compact or url version into its
    individual parts 'user', 'app_name', 'dashboard_name'âˆ‚
    """

    def __init__(self, id_str: str):
        self.id_str = id_str
        self.user = ''
        self.app_name = ''
        self.report_name = id_str

        m = REPORT_ID_URL_MATCHER.search(id_str)

        if m is not None:
            self.user = urllib.unquote_plus(m.group('user'))
            self.app_name = urllib.unquote_plus(m.group('app_name'))
            self.report_name = urllib.unquote_plus(m.group('report_name'))
        else:
            data_list = id_str.split('/')
            if len(data_list) == 3 and all(FIELD_MATCHER.match(data) is not None for data in data_list):
                self.user = urllib.unquote_plus(data_list[0])
                self.app_name = urllib.unquote_plus(data_list[1])
                self.report_name = urllib.unquote_plus(data_list[2])

    def generate_report_key_id(self) -> str:
        """
        Generate key_id hash
        """
        values_to_hash = [self.report_name, self.app_name]
        string_to_hash = ','.join(values_to_hash).encode('utf-8')
        return hashlib.sha256(string_to_hash).hexdigest()

    @staticmethod
    def __parse_from_url__(report_id_url) -> ParsedReportId:
        """
        Helper to generate compact dashboard_id from dashboard_id url
        :param report_id_url:
        :return:
        """
        compact_id = report_id_url
        m = REPORT_ID_URL_MATCHER.search(report_id_url)

        if m is not None:
            compact_id = "%s/%s/%s" % (m.group('user'), m.group('app_name'), m.group('report_name'))

        return ParsedReportId(compact_id)


class NextScheduledTimeParser:
    """
    Helper to parse a next_scheduled_time localized to user's timezone
    Use server localTZ if Time zone is not set in user preferences
    """

    def __init__(self, timezone: str):
        """
        :param timezone: Time Zone string e.g 'America/New_York', 'America/Los_Angeles'
        :return:
        """
        self.timezone = pytz.timezone(timezone) if timezone else None

    def parse_to_localized_timestamp(self, next_scheduled_time_str: str) -> int:
        m = NEXT_SCHEDULED_TIME_MATCHER.match(next_scheduled_time_str)
        if m is not None:
            next_scheduled_datetime = datetime.datetime.strptime(m.group(), NEXT_SCHEDULED_DATETIME_FORMAT)
            if self.timezone:
                return int(self.timezone.localize(next_scheduled_datetime).timestamp())
            else:
                return int(next_scheduled_datetime.replace(tzinfo=localTZ).timestamp())
        return 0
