import sys
import os
import json
import copy
import splunk.rest as sr

if sys.version_info.major == 2:
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'libs_py2'))
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'libs_py2', 'pura_libs_utils'))
elif sys.version_info.major == 3:
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'libs_py3'))
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'libs_py3', 'pura_libs_utils'))

from pura_libs_utils import pura_logger_manager as logger_manager
from pura_libs_utils.pura_consts import *
from pura_libs_utils import pura_utils as utils
from eura_telemetry import Telemetry
import pura_libs_utils.splunklib.results as results
import pura_python_toggle_utils as toggle_utils

logging = logger_manager.setup_logging('eura_remote_latest_report')
NO_APPS = 5

class RemoteLatestReport:
    def __init__(self, session_key):
        self.session_key = session_key
        self.current_roles = []
        self.host = ""
        self.all_hosts = []

    def update_report_summary(self, report):
        """
        Update the report summary.
        :param report: Scan report.
        """
        private_passed_apps = 0
        private_blocker_apps = 0
        public_passed_apps = 0
        public_blocker_apps = 0
        for app in report.get("apps", []):
            app_result = app["summary"]["Status"]
            if app["summary"]["type"] == CONST_PRIVATE:
                if app_result == CHECK_CONST_PASSED:
                    private_passed_apps += 1
                elif app_result == CHECK_CONST_BLOCKER:
                    private_blocker_apps += 1
            else:
                if app_result == CHECK_CONST_PASSED:
                    public_passed_apps += 1
                elif ((app_result == CHECK_CONST_UNKNOWN) or (app_result == CHECK_CONST_BLOCKER)):
                    public_blocker_apps += 1
        if report:
            report["summary"].update({
                "public_passed": public_passed_apps,
                "public_blocker": public_blocker_apps,
                "private_passed": private_passed_apps,
                "private_blocker": private_blocker_apps
            })

    def update_app_summary(self, app_report):
        """
        Update the summary of the app.
        :param app_report: Report of the app.
        """
        passed = 0
        blocker = 0
        for check in app_report.get("checks"):
            if check["result"] == CHECK_CONST_PASSED:
                passed += 1
            elif check["result"] == CHECK_CONST_BLOCKER:
                blocker += 1
        if blocker > 0:
            if (app_report["summary"]["type"] != CONST_PRIVATE):
                status = CHECK_CONST_UNKNOWN
            else:
                status = CHECK_CONST_BLOCKER
        else:
            status = CHECK_CONST_PASSED

        app_report["summary"].update({
            "Passed": passed,
            "Blocker": blocker,
            "Status": status
        })

    def update_check_result(self, local_check, remote_check):
        """
        Update the check result by comparing the local and remote check.
        :param local_check: Check field of the local report.
        :param remote_check: Check field of the remote report.
        """
        if (local_check["result"] == CHECK_CONST_SKIPPED) or (remote_check["result"] == CHECK_CONST_SKIPPED):
            local_check["result"] = CHECK_CONST_SKIPPED
        elif (local_check["result"] == CHECK_CONST_BLOCKER) or (remote_check["result"] == CHECK_CONST_BLOCKER):
            local_check["result"] = CHECK_CONST_BLOCKER
        elif (local_check["result"] == CHECK_CONST_WARNING) or (remote_check["result"] == CHECK_CONST_WARNING):
            local_check["result"] = CHECK_CONST_WARNING
        else:
            local_check["result"] = CHECK_CONST_PASSED

    def get_all_apps(self):
        logging.info("Starting to get apps")
        endpoint = "/services/eura_app_list?type={}".format(TYPE_DEPLOYMENT)
        try:
            response, content = sr.simpleRequest(path=endpoint, sessionKey=self.session_key, method="GET")
        except Exception as e:
            logging.exception(MESSAGE_EXCEPTION_REST_CALL.format(str(e)))
            return []
        if str(response["status"]) not in success_codes:
            logging.error(MESSAGE_ERROR_FETCHING_APPS.format(response["status"], content))
            return []
        apps = []
        content = json.loads(content)
        for app in content:
            if app["visible"] == "ENABLED":
                apps.append(app["name"])
        logging.info("Successfully got apps")
        return apps

    def get_latest_local_report_name(self):
        if not os.path.exists(EMERALD_REPORT_PATH):
            return None
        list_reports = os.listdir(EMERALD_REPORT_PATH)
        persistent_splunk_sys_user_report = PERSISTENT_FILE_JSON.format("splunk-system-user")
        local_file_name = None
        max_timestamp = None
        for report in list_reports:
            report_timestamp = int(report.split("_")[-1].replace(".json", ""))
            if (
                (report[:-16] == "splunk-system-user" and report != persistent_splunk_sys_user_report) and
                (max_timestamp is None or report_timestamp > max_timestamp)
            ):
                local_file_name = report
                max_timestamp = report_timestamp
        return local_file_name


    def update_app_type(self, local_app, remote_app):
        if (local_app["summary"]["type"] != CONST_PRIVATE) and (remote_app["summary"]["type"] != CONST_PRIVATE):
            if (local_app["summary"]["type"] == CONST_SPLUNKBASE_NONE) or (remote_app["summary"]["type"] == CONST_SPLUNKBASE_NONE):
                local_app["summary"]["type"] = CONST_SPLUNKBASE_NONE
            else:
                local_app["summary"]["type"] = CONST_SPLUNKBASE_9_X

    def merge_remote_and_local_report(self, remote_report):
        """
        Merge the remote and local report into the local report.
        :param remote_report: Content of the remote report
        :returns Whether the remote and local report were merged successfully or not.
        """
        try:
            local_file_name = self.get_latest_local_report_name()
            if not local_file_name:
                logging.info("splunk-system-user file does not exists.")
                return True, {}
            local_file_path = os.path.join(EMERALD_REPORT_PATH, local_file_name)
            with open(local_file_path, "r") as f:
                local_report = json.load(f)
            for local_app in local_report.get("apps", []):
                is_remote_app_found = False
                is_app_type_different = False
                for remote_app in remote_report.get("apps", []):
                    if local_app["name"] == remote_app["name"]:
                        is_remote_app_found = True
                        local_app["remote_version"] = local_app["version"]
                        if local_app["version"] != remote_app["version"]:
                            local_app["remote_version"] = remote_app["version"]
                        if (((local_app["summary"]["type"] == CONST_PRIVATE) and (remote_app["summary"]["type"] != CONST_PRIVATE)) or
                        ((local_app["summary"]["type"] != CONST_PRIVATE) and (remote_app["summary"]["type"] == CONST_PRIVATE))):
                            is_app_type_different = True
                            continue
                        for remote_check in remote_app.get("checks", []):
                            for local_check in local_app.get("checks", []):
                                if local_check["name"] == remote_check["name"]:
                                    # if there is no remote message but there is local message
                                    # then the fields instance and identical will not be added
                                    is_remote_message_found = False
                                    local_check_messages_len = len(local_check.get("messages", []))
                                    for remote_message in remote_check.get("messages", []):
                                        is_remote_message_found = True
                                        found = False
                                        for i in range(0, local_check_messages_len):
                                            local_message = local_check["messages"][i]
                                            if local_message.get("instance") is None or local_message.get("identical") is None:
                                                local_message["instance"] = "local"
                                                local_message["identical"] = 0
                                                local_check["messages"][i] = local_message
                                            local_message_file_path = local_app["name"].join(local_message.get("message_filename", "").split(local_app["name"])[1:])
                                            remote_message_file_path = remote_app["name"].join(remote_message.get("message_filename", "").split(remote_app["name"])[1:])
                                            if local_message_file_path == remote_message_file_path:
                                                found = True
                                                if local_message.get("code") == remote_message.get("code"):
                                                    local_message["instance"] = "both"
                                                    local_message["identical"] = 1
                                                    local_check["messages"][i] = local_message
                                                else:
                                                    remote_message["instance"] = "remote"
                                                    remote_message["identical"] = 0
                                                    local_check["messages"].append(remote_message)
                                        if not found:
                                            # there is remote message but no local messages
                                            remote_message["instance"] = "remote"
                                            remote_message["identical"] = 0
                                            local_check["messages"].append(remote_message)
                                    if not is_remote_message_found:
                                        # if there is no messages in remote then iterate all the local message and add the missing fields
                                        for local_message in local_check.get("messages", []):
                                            local_message["instance"] = "local"
                                            local_message["identical"] = 0
                                    self.update_check_result(local_check, remote_check)
                        self.update_app_type(local_app, remote_app)
                        self.update_app_summary(local_app)
                        break
                if (not is_remote_app_found) or (is_app_type_different):
                    # if the local app is not found in remote then add the missing fields
                    # or if the app type is different on local and remote add the missing fields
                    if not is_remote_app_found:
                        local_app["remote_version"] = ""
                    for local_check in local_app.get("checks", []):
                        for local_message in local_check.get("messages", []):
                            local_message["instance"] = "local"
                            local_message["identical"] = 0
            self.update_report_summary(local_report)

            return True, local_report
        except Exception as e:
            logging.exception("Exception occurred while merging report: {}".format(str(e)))
        return False, {}

    def check_telemetry_to_be_sent(self):
        """
        Check if the telemetry data is to sent using the instance.

        :return Boolean: Whether the telemetry data is to sent from the instance.
        """
        if "search_head" in self.current_roles:
            if "shc_member" not in self.current_roles:
                return True
            return False
        elif "indexer" in self.current_roles:
            if "search_peer" not in self.current_roles:
                return True
            return False
        else:
            return False

    def get_results(self, apps):
        service = utils.get_connection_object(self.session_key)
        host_details = utils.get_host_details(service)
        self.host = host_details["host"]
        self.all_hosts = host_details["all_hosts"]
        self.current_roles = host_details["current_roles"]

        if not os.path.exists(LOCAL_DIR):
            os.mkdir(LOCAL_DIR)
        if not os.path.exists(EMERALD_MERGED_DIR):
            os.mkdir(EMERALD_MERGED_DIR)
        if not os.path.exists(EMERALD_REMOTE_DIR):
            os.mkdir(EMERALD_REMOTE_DIR)

        is_merged_report_written = False
        merged_report = {}
        merged_file_path = os.path.join(EMERALD_MERGED_DIR, MERGED_FILE_JSON)
        logging.info("merged_file_path = {}".format(merged_file_path))
        for host_details in self.all_hosts:
            host = host_details["host"]
            if host == self.host:
                continue
            try:
                remote_file_path = os.path.join(EMERALD_REMOTE_DIR, "{}.json".format(host))
                logging.info("remote_file_path = {}".format(remote_file_path))
                scan_report = {}
                for i in range(0, len(apps), NO_APPS):
                    # iterate the apps and then fetch the report for the apps
                    pura_apps = apps[i:(i+NO_APPS)]
                    pura_apps_str = ",".join(pura_apps)
                    one_shot_str = "| rest splunk_server=\"{}\" services/eura_latest_report eura_apps=\"{}\"".format(host, pura_apps_str)
                    reader = utils.one_shot_str_wrapper(
                        one_shot_str,
                        service
                    )
                    content = {}
                    for item in reader:
                        if not isinstance(item, dict):
                            if isinstance(item, results.Message):
                                logging.info("Skipping Message object: {}".format(item.__repr__()))
                            continue
                        content = dict(item)
                        content = json.loads(content["value"])
                        if scan_report.get("apps", []) == []:
                            scan_report["apps"] = []
                        scan_report["apps"].extend(content["apps"])
                        if scan_report.get("host", None) is None:
                            scan_report["host"] = content["host"]
                        if scan_report.get("scan_id", None) is None:
                            scan_report["scan_id"] = content["scan_id"]
                        if scan_report.get("summary", {}) == {}:
                            scan_report["summary"] = content["summary"]
                        logging.info("Successfully got response for apps {}".format(pura_apps_str))
                if not scan_report.get("apps"):
                    logging.info("Skipping to write report from indexer: {} as it is empty."
                                 "Trying to fetch result from another indexer".format(host))
                    is_merged_report_written = False
                    continue
                remote_report = copy.deepcopy(scan_report)
                are_reports_merged, merged_report = self.merge_remote_and_local_report(scan_report)
                # write report in EMERALD_REMOTE_DIR
                with open(remote_file_path, "w+") as f:
                    json.dump(remote_report, f)

                # remove all the files except the current one from the EMERALD_REMOTE_DIR
                for path in os.listdir(EMERALD_REMOTE_DIR):
                    path = os.path.join(EMERALD_REMOTE_DIR, path)
                    if path != remote_file_path and os.path.exists(path) and os.path.isfile(path):
                        os.remove(path)
                if not are_reports_merged:
                    logging.error("Some exception has ocured"
                                  " while merging the remote and local report")
                    is_merged_report_written = False
                    break
                # write report to EMERALD_MERGED_DIR
                with open(merged_file_path, "w+") as f:
                    json.dump(merged_report, f)
                is_merged_report_written = True
                break
            except Exception as e:
                logging.exception("Exception occurred while fetching remote latest report: {}".format(str(e)))
        if not is_merged_report_written:
            logging.info("Writing local report as merged report could not be generated.")
            _, merged_report = self.merge_remote_and_local_report({})
            with open(merged_file_path, "w+") as f:
                json.dump(merged_report, f)
        is_telemetry_data_to_be_sent = self.check_telemetry_to_be_sent()
        if is_telemetry_data_to_be_sent:
            self.telemetry_update(merged_report)

    def telemetry_update(self, local_report):
        """
        Update the telemetry data for apps and user actions

        :param local_report: Report from which apps data is collected
        """
        try:
            telemetry_report = copy.deepcopy(local_report)
            dismiss_app_details = utils.get_dismiss_app_kvstore_details(self.session_key, "emerald")
            dismiss_file_details = utils.get_dismiss_file_kvstore_details(self.session_key, "emerald")
            dismiss_check_details = utils.get_dismiss_check_kvstore_details(self.session_key)
            results_dismissed_apps_copy = copy.deepcopy(telemetry_report)
            are_dismissed_apps_filtered = utils.filter_dismissed_apps(telemetry_report, dismiss_app_details)
            if not are_dismissed_apps_filtered:
                logging.error(MESSAGE_SKIP_DISMISS_APPS)
                telemetry_report = results_dismissed_apps_copy
            results_dismissed_files_copy = copy.deepcopy(telemetry_report)
            are_dismissed_files_filtered = utils.filter_dismissed_files(telemetry_report, dismiss_file_details, scan_type="emerald")
            if not are_dismissed_files_filtered:
                logging.error(MESSAGE_SKIP_DISMISS_FILES)
                telemetry_report = results_dismissed_files_copy
            results_dismissed_checks_copy = copy.deepcopy(telemetry_report)
            are_dismissed_checks_filtered = utils.filter_dismissed_checks(telemetry_report, dismiss_check_details)
            if not are_dismissed_checks_filtered:
                logging.error(MESSAGE_SKIP_DISMISS_SYSTEM_CHECK)
                telemetry_report = results_dismissed_checks_copy
            
            export_report_details = utils.get_export_report_kvstore_details(self.session_key, scan_type="emerald")
            utils.delete_kvstore_details(self.session_key, era_remote_export_report_endpoint)
            
            send_email_details = utils.get_send_email_kvstore_details(self.session_key, scan_type="emerald")
            utils.delete_kvstore_details(self.session_key, era_remote_send_email_endpoint)
            
            page_visits_details = utils.get_page_visits_kvstore_details(self.session_key, scan_type="emerald")
            utils.delete_kvstore_details(self.session_key, era_page_visits_endpoint)

            email_notification_switch_data = utils.get_details_from_kvstore(era_email_switch_endpoint, self.session_key, user="", host=self.host)
            
            self.telemetry_handler = Telemetry(self.session_key, "splunk-system-user")
            self.telemetry_handler.init_telemetry()
            if (not self.telemetry_handler.telemetry_data) and (not self.telemetry_handler.scan_summary):
                logging.info("Skipping to send telemetry data.")
                return True, local_report
            self.telemetry_handler.telemetry_data.update({
                'apps': list(),
                'system': telemetry_report.get("system", []),
                'export_report': dict(),
                'send_email': dict(),
                'page_visits': dict(),
                'email_switch': dict()
            })
            self.telemetry_handler.scan_summary.update({
                'apps': list(),
                'system': telemetry_report.get("system", []),
                'export_report': dict(),
                'send_email': dict(),
                'page_visits': dict(),
                'email_switch': dict()
            })
            for _app in telemetry_report.get("apps", []):
                self.telemetry_handler.update_telemetry_data(_app, _app["summary"]["Status"], _app, None,
                                                                False, default=False)
            
            self.telemetry_handler.scan_summary['export_report'] = {
                'data': export_report_details,
                'count': len(export_report_details)
            }
            self.telemetry_handler.scan_summary['send_email'] = {
                'data': send_email_details,
                'count': len(send_email_details)
            }
            self.telemetry_handler.scan_summary['page_visits'] = {
                'data': page_visits_details,
                'count': len(page_visits_details),
                'unique_visitors_count': len(set(visit['user'] for visit in page_visits_details))
            }
            self.telemetry_handler.scan_summary['email_switch'] = {
                'is_era_email_enabled' : email_notification_switch_data.get('is_era_email_enabled', 1)
            }
            
            telemetry_export_report_details = []
            for sub in export_report_details:
                temp = {}
                for key, val in sub.items():
                    if (key == "app_name") and (val != ALL_APPS_NAME):
                        val = 'XXXXXXXXXXX'
                    elif (key == "app_name") and (val == ALL_APPS_NAME):
                        val = ALL_APPS_NAME_TELEMETRY
                    temp[key] = val
                telemetry_export_report_details.append(temp)

            telemetry_send_email_details = []
            for sub in send_email_details:
                temp = {}
                for key, val in sub.items():
                    if (key == "app_name") and (val != ALL_APPS_NAME):
                        val = 'XXXXXXXXXXX'
                    elif (key == "app_name") and (val == ALL_APPS_NAME):
                        val = ALL_APPS_NAME_TELEMETRY
                    temp[key] = val
                telemetry_send_email_details.append(temp)

            telemetry_page_visit_details = copy.deepcopy(page_visits_details)

            unique_page_visitors_count = len(set(visit['user'] for visit in page_visits_details))

            for export_report_detail in telemetry_export_report_details:
                export_report_detail['user'] = 'XXXXXXXXXXX'

            for send_email_detail in telemetry_send_email_details:
                send_email_detail['user'] = 'XXXXXXXXXXX'

            for page_visits_detail in telemetry_page_visit_details:
                page_visits_detail['user'] = 'XXXXXXXXXXX'
                
            self.telemetry_handler.telemetry_data['export_report'] = {
                'export_report_details': telemetry_export_report_details,
                'count': len(telemetry_export_report_details)
            }
            self.telemetry_handler.telemetry_data['send_email'] = {
                'send_email_details': telemetry_send_email_details,
                'count': len(telemetry_send_email_details)
            }
            self.telemetry_handler.telemetry_data['page_visits'] = {
                'page_visits_details': telemetry_page_visit_details,
                'page_visits_count': len(telemetry_page_visit_details),
                'unique_visitors_count': unique_page_visitors_count
            }
            self.telemetry_handler.telemetry_data['email_switch'] = {
                'is_era_email_enabled': email_notification_switch_data.get('is_era_email_enabled', 1)
            }

            self.telemetry_handler.send_telemetry()
            self.telemetry_handler.send_action_summary(self.telemetry_handler.telemetry_data['export_report'])
            self.telemetry_handler.send_action_summary(self.telemetry_handler.telemetry_data['send_email'])
            self.telemetry_handler.send_action_summary(self.telemetry_handler.telemetry_data['page_visits'])
            self.telemetry_handler.send_action_summary(self.telemetry_handler.telemetry_data['email_switch'])
            self.telemetry_handler.write_scan_summary()
            self.telemetry_handler.write_to_audit()
        except Exception as e:
            logging.exception(str(e))

if __name__ == "__main__":
    sessionKey = sys.stdin.readline().strip()
    obj = RemoteLatestReport(session_key=sessionKey)
    try:
        apps = obj.get_all_apps()
        obj.get_results(apps)
    except Exception as e:
        logging.exception(str(e))
