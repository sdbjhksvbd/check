import logging
from typing import List

import splunk
import time
import json

from spacebridgeapp.util.constants import ENTRY, CONTENT, NAME
from spacebridgeapp.request.splunk_auth_header import SplunkAuthHeader
from spacebridgeapp.rest.services.splunk_service import get_saved_search_history, get_search_results

# The first result (inclusive) from which to begin returning data. This value is 0-indexed. Default value is 0.
SEARCH_OFFSET = 0
# The maximum number of results to return. If value is set to 0, then all available results are returned.
SEARCH_COUNT = 50


class ParseReports:
    """
    Helper class to fetch the saved search history and saved search results from splunk
    """

    def __init__(self, log: logging.Logger, session_key: str):
        self.session_key = session_key
        self.system_auth_header = SplunkAuthHeader(self.session_key)
        self.log = log

    def get_latest_saved_search_sid(self, saved_search_name: str, app: str, owner: str) -> str:
        """
        Get the saved search history and return the sid of the latest run
        :param saved_search_name: name of the saved search
        :param app: Splunk app where saved search is stored
        :param owner: Owner of the saved search
        """
        search_offset = SEARCH_OFFSET
        search_results = []

        try:
            partial_saved_search_history = get_saved_search_history(self.log, self.session_key, owner, app,
                                                                    saved_search_name, offset=search_offset,
                                                                    count=SEARCH_COUNT)
            while len(partial_saved_search_history) != 0:
                for result in partial_saved_search_history:
                    if result not in search_results:
                        search_results.append(result)

                search_offset += SEARCH_COUNT

                partial_saved_search_history = get_saved_search_history(self.log, self.session_key, owner, app,
                                                                        saved_search_name, offset=search_offset,
                                                                        count=SEARCH_COUNT)
        except Exception as e:
            self.log.debug(f'Error occurred while fetching search results {e}')

        try:
            latest_run = max(search_results, key=lambda x: time.strptime(x['published'], "%Y-%m-%dT%H:%M:%S%z"))
            return latest_run[NAME]
        except Exception as e:
            self.log.debug(f'Exception occurred while fetching the latest saved search from the history {e}')
            return None

    def fetch_search_results_sid(self, sid: str) -> List[dict]:
        """
        Fetch search results in batches given a sid and store it in a dict
        :param sid: Search ID for the given search
        """

        search_results = []
        search_offset = SEARCH_OFFSET

        try:
            partial_search_results = get_search_results(self.log, self.session_key, sid, offset=search_offset,
                                                        count=SEARCH_COUNT)

            while len(partial_search_results) != 0:
                for result in partial_search_results:
                    if result not in search_results:
                        search_results.append(result)

                search_offset += SEARCH_COUNT
                partial_search_results = get_search_results(self.log, self.session_key, sid, offset=search_offset,
                                                            count=SEARCH_COUNT)
            return search_results
        except Exception as e:
            self.log.debug(f'Error occurred while fetching search results {e}')
            return search_results if len(search_results) > 0 else []
