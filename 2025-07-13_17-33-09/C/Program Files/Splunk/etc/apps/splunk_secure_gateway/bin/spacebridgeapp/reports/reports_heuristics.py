"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.
"""
import json
import logging
import math
from collections import defaultdict
from datetime import datetime
from http import HTTPStatus
from typing import Dict, List

import splunk

from dateutil.relativedelta import relativedelta
from spacebridgeapp.alerts.alert_action import MobileAlertAction
from spacebridgeapp.reports.heuristics_helper import ParseReports
from spacebridgeapp.request.splunk_auth_header import SplunkAuthHeader
from spacebridgeapp.rest.notifications.subscribe_report import ReportNotificationSubscribeHandler, \
    subscribe_user_to_report
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject as KvStore
from spacebridgeapp.rest.services.splunk_service import get_saved_search, subscribe_to_reports
from spacebridgeapp.rest.util.errors import SsgHttpError
from spacebridgeapp.util.constants import HEURISTICS_SUBSCRIBED_STATE, HEURISTICS_STATUS, \
    REPORT_HEURISTICS_COLLECTION_NAME, REGISTERED_USERS_COLLECTION_NAME, KEY, TIMESTAMP, \
    HEURISTICS_SAVED_SEARCH_ACCESS_WITHIN_DAY, SPACEBRIDGE_APP_NAME, NOBODY, TRUE
from spacebridgeapp.util.time_utils import get_current_timestamp

TIMEOUT_SECONDS = 60
MAX_REPORTS_FROM_HEURISTICS = 3
SLICING_PERCENTAGE = 20


class ReportHeuristics(object):

    def __init__(self, log: logging.Logger, session_key):
        """
        Report Heuristics constructor
        :param session_key: session key passed by modular input
        """
        self.session_key = session_key
        self.system_auth_header = SplunkAuthHeader(self.session_key)
        self.log = log

    def run(self):
        """
        Tries to fetch the results from saved search that returns the list of reports every user is interested in.
        """
        self.log.info("Staring report heuristics run")
        try:
            self.process_report_heuristics()
        except splunk.RESTException as e:
            if e.statusCode == HTTPStatus.SERVICE_UNAVAILABLE:
                self.log.info(f'KVStore is not yet setup. Modular input will not run {e}')
            else:
                raise e

    def process_report_heuristics(self):
        """
        1. Fetch new users from the previous run of the modular input
        2. Get saved search results for the list of users selected
        3. Shortlist reports for those that were accessed within a day of trigger
        4. Shortlist reports by assigning weights based on frequency of access
        """

        try:
            new_users = self.get_new_registered_users()
            self.log.info(f'New users for this heuristics run are {new_users}')

            if len(new_users) == 0:
                self.log.info(
                    f'Skipping SSG Report heuristics run since there are no new users added from the previous times')
                return None

            reports_accessed_by_user = self.get_search_results_for_report_heuristics_saved_search(new_users)
            reports_shortlisted_accessed_within_day = self.shortlisted_reports_users_accessed_within_day(
                reports_accessed_by_user=reports_accessed_by_user)
            reports_shortlisted_by_weights = self.shortlisted_reports_selected_by_weights(
                access_history=reports_accessed_by_user)

            self.log.info(f'Shortlisted users and reports for this heuristics run - \n'
                          f'Calculating by CTR: {reports_shortlisted_accessed_within_day} \n'
                          f'Calculating by Weights: {reports_shortlisted_by_weights}')

            # Skip adding users to heuristics_users if the CTR and weights dicts are empty
            if reports_shortlisted_accessed_within_day and reports_shortlisted_by_weights:
                self.subscribe_users_to_reports(reports_shortlisted_accessed_within_day)
                self.subscribe_users_to_reports(reports_shortlisted_by_weights)

                self.insert_new_users_report_heuristics_collection(new_users)

        except Exception as e:
            self.log.exception("Exception running report heuristics {}".format(e))

    def get_new_registered_users(self) -> List[str]:
        """
        Get all registered users from registered_users collection
        Get all users for whom report heuristics have already run - stored in report_heuristics collection
        Return the symmetric difference of the two lists to get a list of net new users
        """

        try:
            registered_users = KvStore(REGISTERED_USERS_COLLECTION_NAME, self.session_key)
            _, registered_users_serialized = registered_users.get_collection_keys()
            registered_users_list = json.loads(registered_users_serialized)

            reports_subscribed_users = KvStore(REPORT_HEURISTICS_COLLECTION_NAME, self.session_key)
            _, reports_subscribed_users_serialized = reports_subscribed_users.get_collection_keys()
            reports_subscribed_users_list = json.loads(reports_subscribed_users_serialized)

            new_users = [user for user in registered_users_list if user not in reports_subscribed_users_list]
            user_list = []

            for user in new_users:
                user_list.append(user[KEY])

            return user_list

        except Exception as e:
            self.log.exception("Exception getting the list of users {}".format(e))

    def insert_new_users_report_heuristics_collection(self, users):
        """
        Update heuristics collections with a new set of users after subscribing them to reports.
        """

        try:
            users_in_heuristics_collection = KvStore(REPORT_HEURISTICS_COLLECTION_NAME, self.session_key)

            for new_user in users:
                heuristics_collection_item = {
                    KEY: new_user,
                    HEURISTICS_STATUS: HEURISTICS_SUBSCRIBED_STATE,
                    TIMESTAMP: get_current_timestamp()
                }
                users_in_heuristics_collection.insert_single_item(heuristics_collection_item)
                self.log.info(f'Inserted new user to heuristics collection - {new_user}')
        except Exception as e:
            self.log.exception(f'Error updating reports heuristics collection {e}')

    def get_search_results_for_report_heuristics_saved_search(self, new_users: List[str]) -> Dict:
        """
        This method gets the results from the heuristics saved search and gets results matching only the users in
        the new_users list
        :param new_users: List of new users
        """
        search_results = List[dict]

        try:
            saved_search_helper = ParseReports(self.log, self.session_key)
            latest_saved_search_sid = saved_search_helper.get_latest_saved_search_sid(
                saved_search_name=HEURISTICS_SAVED_SEARCH_ACCESS_WITHIN_DAY, app=SPACEBRIDGE_APP_NAME, owner=NOBODY)
            self.log.info(f'SID for the most recent heuristics saved search run is {latest_saved_search_sid}')

            search_results = saved_search_helper.fetch_search_results_sid(latest_saved_search_sid)
            self.log.info(f'Report heuristics will be run against {len(search_results)} results')
        except Exception as e:
            self.log.debug(f'Exception occurred while fetching search results {e}')

        new_user_access_history = defaultdict(list)
        try:
            for each_result in search_results:
                if each_result["accesslogs.L.user"] in new_users:
                    key = (
                        each_result["accesslogs.L.user"], each_result["accesslogs.R.title"], each_result["accesslogs.R"
                                                                                                         ".app"])
                    new_user_access_history[key].append(each_result)
            return new_user_access_history
        except Exception as e:
            self.log.debug(f'Exception occurred while creating the search results dict {e}')
            return {}

    def shortlisted_reports_selected_by_weights(self, access_history: Dict[any, any]):
        """
        This method takes the access history of all the reports that were accessed by the user and assigns them
        weights based on when they accessed it and how many times they accessed it. It then shortlists by choosing
        the top few
        :param access_history: Reports that the user accessed in the last one year
        """
        MULTIPLIER_PAST_FOUR_MONTHS = 4
        MULTIPLIER_PAST_EIGHT_MONTHS = 2
        MULTIPLIER_PAST_YEAR = 1
        reports_with_weights = defaultdict(list)

        for each_key in access_history.keys():
            username, report_title, report_app = each_key
            weight_for_report = 0

            try:
                report_owner = access_history.get(each_key)[0].get("accesslogs.R.author")
                report_id = access_history.get(each_key)[0].get("accesslogs.R.id")

                # check if user previously unsubscribed to the report
                if self.check_if_previously_unsubscribed(user=username, report_title=report_title,
                                                         report_app=report_app,
                                                         report_owner=report_owner):
                    self.log.info(
                        f'{username} previously unsubscribed from report - {report_title} ignoring this from heuristics')
                    continue
            except IndexError as e:
                self.log.debug(f'Unable to fetch report owner and report id form the access history {e}')
            except Exception as e:
                self.log.debug(
                    f'Unable to check if the user was previously subscribed to this report {username} {report_title} {e}')

            try:
                for search_records_by_report in access_history.get(each_key):
                    current_date_and_time = datetime.now()
                    access_time = datetime.fromtimestamp(
                        int(search_records_by_report["accesslogs.L.accessTimestamp"]) // 1000)

                    if (current_date_and_time - relativedelta(months=4)) <= access_time <= current_date_and_time:
                        weight_for_report = weight_for_report + MULTIPLIER_PAST_FOUR_MONTHS
                    elif (current_date_and_time - relativedelta(months=8)) <= access_time < (
                        current_date_and_time - relativedelta(months=4)):
                        weight_for_report = weight_for_report + MULTIPLIER_PAST_EIGHT_MONTHS
                    else:
                        weight_for_report = weight_for_report + MULTIPLIER_PAST_YEAR
            except Exception as e:
                self.log.debug(f'Unable to calculate weight for the report {search_records_by_report}')

            weight_dict_for_this_user = {
                "report_title": report_title,
                "report_app": report_app,
                "weight": weight_for_report,
                "report_owner": report_owner,
                "report_id": report_id
            }

            reports_with_weights[username].append(weight_dict_for_this_user)

        return self.slice_reports_list(reports=reports_with_weights, sort_key="weight")

    def shortlisted_reports_users_accessed_within_day(self, reports_accessed_by_user) -> dict:
        """
        This method returns the top most accessed reports for every new user. The reports considered here are the
        reports users accessed within one day of when it was run
        :param reports_accessed_by_user: Access records of only the new users
        """

        click_through_ratio = {}

        for key in reports_accessed_by_user.keys():

            # if user has previously unsubscribed to this report, then skip calculating CTR for this report
            try:
                user, report_title, report_app = key
                report_owner = reports_accessed_by_user.get(key)[0].get("accesslogs.R.author")
                if self.check_if_previously_unsubscribed(user=user, report_title=report_title, report_app=report_app,
                                                         report_owner=report_owner):
                    self.log.info(
                        f'{user} previously unsubscribed from report - {report_title} ignoring this from heuristics')
                    continue
            except Exception as e:
                self.log.debug(
                    f'Could not verify if user {user} previously unsubscribed from this report {report_title} {e}')

            user_view_count_per_report = 0
            total_count_per_report = 0

            try:
                for each_generated_report in reports_accessed_by_user[key]:
                    if each_generated_report["accessedWithinOneDayofDispatch"] == TRUE:
                        user_view_count_per_report = user_view_count_per_report + 1
                        total_count_per_report = total_count_per_report + 1
                    else:
                        total_count_per_report = total_count_per_report + 1
                ratio = (user_view_count_per_report / total_count_per_report)
                click_through_ratio[key] = {"views": user_view_count_per_report,
                                            "total_views_per_report": total_count_per_report, "ratio": ratio}
            except ZeroDivisionError as z:
                self.log.debug(f"Report was not viewed by the user exception: {z}")
                click_through_ratio[key] = {"views": 0,
                                            "total_views_per_report": 0, "ratio": 0}
            except Exception as e:
                self.log.debug(f"Failed to get click through ration for user/report combination {e}")

        self.log.info(f'Calculated CTR for all the reports that were viewed within one day of the trigger')
        merged_reports_by_user = self.merge_reports_with_ctr(search_records=reports_accessed_by_user,
                                                             click_through_ratio=click_through_ratio)
        # pick top 20% of the reports from the click through ratio list upto max defined for each user
        return self.slice_reports_list(reports=merged_reports_by_user, sort_key="report_ratio")

    def subscribe_users_to_reports(self, reports: Dict[str, List[Dict]]):
        """
        Given a dict of users as key and reports as values. Subscribe each user to the list of the reports that were
        shortlisted
        :param reports: Shortlisted reports for all new users.
        """
        for username in reports.keys():
            reports_to_be_subscribed = reports.get(username)
            for each_report in reports_to_be_subscribed:
                try:
                    self.log.debug(f'Subscribing {username} to {each_report["report_id"]}')

                    status = subscribe_user_to_report(log=self.log,
                                                      user_session_token=self.session_key,
                                                      system_session_token=self.session_key,
                                                      user=username,
                                                      owner=each_report["report_owner"],
                                                      app_name=each_report["report_app"],
                                                      report_name=each_report["report_title"])

                    if status != HTTPStatus.OK:
                        self.log.debug(f'Exception occurred while subscribing {username} to {each_report["report_id"]}')
                        raise SsgHttpError("Httpstatus for report subscribe is not ok", status)

                    self.log.info(
                        f'Completed report notification subscription request with status={status} for '
                        f'user={username} and report = {each_report["report_id"]}')
                except Exception as e:
                    self.log.debug(f'Unable to subscribe {username} to report {each_report["report_id"]} \n {e}')

    def check_if_previously_unsubscribed(self, user: str, report_title: str, report_app: str, report_owner=str) -> bool:
        """
        This method accepts a report and checks if the given user ever unsubscribed to this report. This information
        will be used in the filtering criteria where if the user has previously unsubscribed, then they won't be auto
        subscribed to the same report by this mod input.
        """
        saved_search_content = get_saved_search(self.session_key, owner=report_owner, name=report_title,
                                                app=report_app)
        actions = MobileAlertAction.parse_saved_search_response(saved_search_content)

        return user in actions.previous_subscribers

    def merge_reports_with_ctr(self, search_records: dict, click_through_ratio: dict):
        """
        Takes the search records dict and CTR dict whose keys are a tuple of (username, report title and report app)
        and returns a single dict with username as the key and a list of dicts of reports user has accessed the most
        along with its click through ratio
        :param search_records: search results from heuristics saved search
        :param click_through_ratio: the ratio of reports users clicked within a day of it's dispatch
        """
        merge_reports_by_user = defaultdict(list)
        try:
            for each_report_key in click_through_ratio.keys():
                username, report_title, report_app = each_report_key
                try:
                    report_owner = search_records.get(each_report_key)[0].get("accesslogs.R.author")
                    report_id = search_records.get(each_report_key)[0].get("accesslogs.R.id")

                    report_dict = {
                        "report_title": report_title,
                        "report_app": report_app,
                        "report_ratio": click_through_ratio[each_report_key]["ratio"],
                        "report_owner": report_owner,
                        "report_id": report_id
                    }

                    merge_reports_by_user[username].append(report_dict)
                except IndexError as e:
                    self.log.debug(f'Unable to fetch report owner and report id form the access history {e}')
        except Exception as e:
            self.log.debug(f'Unable to merge search records and ctr into a single dict {e}')

        return merge_reports_by_user

    def slice_reports_list(self, reports: dict, sort_key: str) -> dict:
        """
        This method takes the shortlisted reports for all users where key is the username and value is a list of
        reports we want to subscribe the user to. It sorts each list based on sorting key: Either weight or
        click-through-ratio and slices it based on the percentage of reports we want to select and the max we want to
        subscribe
        :param reports: dict of report by user
        :param sort_key: key by which we want to sort the reports per user.
        """
        for each_user in reports.keys():
            reports[each_user] = sorted(reports[each_user],
                                        key=lambda x: x[sort_key],
                                        reverse=True)
            slice_length_for_reports = math.ceil(len(reports[each_user]) * (SLICING_PERCENTAGE / 100))

            reports[each_user] = reports.get(each_user)[:slice_length_for_reports][
                                 :MAX_REPORTS_FROM_HEURISTICS]
            self.log.info(f'Completed report selection for {each_user}')

        return reports
