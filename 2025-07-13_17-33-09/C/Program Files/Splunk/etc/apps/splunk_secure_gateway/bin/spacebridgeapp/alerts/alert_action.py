from dataclasses import dataclass
from typing import Dict, Set, List
import json
from spacebridgeapp.data.base import SpacebridgeAppBase


class MobileAlertActionParams:
    """ constant values for alert action parameter values to stored in Splunk """
    ENABLED = 'action.ssg_mobile_alert'
    ACTIONS = 'actions'
    NOTIFICATION_TYPE = 'action.ssg_mobile_alert.param.notification_type'
    RECIPIENT_USERS = 'action.ssg_mobile_alert.param.recipient_users'
    PREVIOUS_SUBSCRIBERS = 'action.ssg_mobile_alert.param.previous_subscribers'
    ACTION_NAME = 'ssg_mobile_alert'


class NotificationType:
    REPORT = 'report'


@dataclass
class MobileAlertAction(SpacebridgeAppBase):
    """ Data class for encapsulating mobile alert action logic """
    enabled: str
    notification_type: str
    recipient_users: Set[str]
    previous_subscribers: Set[str]
    actions: List[str]

    @staticmethod
    def is_report(content: Dict[str, any]) -> bool:
        # https://community.splunk.com/t5/Alerting/What-is-the-difference-between-alert-and-report/m-p/368683
        return content.get('alert_type') == 'always' and content.get('alert.track', '') == False

    @staticmethod
    def parse_saved_search_response(content: Dict[str, any]):
        """ parse saved search response and build MobileAlertAction object """
        recipient_users_serialized = content.get(MobileAlertActionParams.RECIPIENT_USERS, '')
        actions_serialized = content.get(MobileAlertActionParams.ACTIONS, '')
        previous_subscribers_serialized = content.get(MobileAlertActionParams.PREVIOUS_SUBSCRIBERS, '')

        recipient_users = set(json.loads(recipient_users_serialized)) if recipient_users_serialized else set()
        previous_subscribers = set(
            json.loads(previous_subscribers_serialized)) if previous_subscribers_serialized else set()
        actions = actions_serialized.split(',') if actions_serialized else []

        notification_type = content.get(MobileAlertActionParams.NOTIFICATION_TYPE, '')

        if not notification_type and MobileAlertAction.is_report(content):
            notification_type = NotificationType.REPORT

        return MobileAlertAction(
            content.get(MobileAlertActionParams.ENABLED, '0'),
            notification_type,
            recipient_users,
            previous_subscribers,
            actions
        )

    def to_saved_search_format(self) -> Dict[str, str]:
        """ return dictionary which can be persisted to saved search endpoint to save alert action """
        return {
            MobileAlertActionParams.ENABLED: self.enabled,
            MobileAlertActionParams.NOTIFICATION_TYPE: self.notification_type,
            MobileAlertActionParams.RECIPIENT_USERS: json.dumps(list(self.recipient_users)),
            MobileAlertActionParams.PREVIOUS_SUBSCRIBERS: json.dumps(list(self.previous_subscribers)),
            MobileAlertActionParams.ACTIONS: ','.join(str(s) for s in self.actions)
        }

    def add_user(self, user: str) -> None:
        """ Add user to recipient users and re-enable action if currently disabled """
        self.recipient_users.add(user)

        # If user unsubscribed in the past, this removes them from the unsubscribed list before subscribing them again.
        if user in self.previous_subscribers:
            self.previous_subscribers.remove(user)

        if not self.enabled or self.enabled == '0':
            self.enabled = '1'
            self.actions.append(MobileAlertActionParams.ACTION_NAME)

    def remove_user(self, user: str) -> None:
        """ Remove user from recipient users and disable action if recipient users is empty"""
        if user in self.recipient_users:
            self.recipient_users.remove(user)

        self.previous_subscribers.add(user)

        if not self.recipient_users:
            self.enabled = '0'
            if MobileAlertActionParams.ACTION_NAME in self.actions:
                self.actions.remove(MobileAlertActionParams.ACTION_NAME)
