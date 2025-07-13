"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.
"""
import logging
import os

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
from http import HTTPStatus
from spacebridge_protocol import http_pb2
from spacebridge_protocol import sb_common_pb2
from splapp_protocol import envelope_pb2
from splapp_protocol import common_pb2
from spacebridgeapp.exceptions.splunk_api_exceptions import HTTPException

TTL_SECONDS = 259200



def build_notification_request(log: logging.Logger,
                               device_id, device_id_raw, sender_id, notification, encrypt, sign):
    """
    :param log:
    :param device_id: A string representation of the device id
    :param device_id_raw: A byte representation of the device id
    :param sender_id: A byte representation of the sender
    :param notification: A Notification proto object
    :param encrypt: a 1 argument function that encrypts some plaintext
    :param sign: a 1 argument function that will calculate a signature for some byte input
    :return: A proto notification message if encryption and signing succeed, None otherwise
    """

    log.info("Building notification alert_id=%s, device_id=%s" % (notification.alert_id, device_id))
    unsigned_notification = build_notification(notification, device_id_raw, sender_id, encrypt)
    unsigned_notification.signedEnvelope.signature = sign(unsigned_notification.signedEnvelope.serialized)
    return unsigned_notification


async def async_build_notification_request(log: logging.Logger,
                               device_id, device_id_raw, sender_id, notification, encrypt, async_sign_payload):

    log.info("Building notification alert_id=%s, device_id=%s" % (notification.alert_id, device_id))
    unsigned_notification = build_notification(notification, device_id_raw, sender_id, encrypt)
    r = await async_sign_payload(unsigned_notification.signedEnvelope.serialized)
    if r.code != HTTPStatus.OK:
        response_text = await r.text()
        raise HTTPException(f'Failed to generate valid signature with error={response_text}', r.code)
    
    # Unfortunately for binary responses, aiohttp doesn't have a method to return the raw output with no encoding
    # so we have to access the content body directly
    unsigned_notification.signedEnvelope.signature = r._body
    return unsigned_notification



def build_notification(notification, recipient, sender, encrypt):
    """
    Takes a notification object and a recipient id and builds the corresponding SendNotificationRequest proto
    object which will be posted to Spacebridge
    :param notification: Notification object to sent
    :param recipient: String representing id of recipient
    :return: SendNotificatipnRequest proto
    """
    send_notification_request = http_pb2.SendNotificationRequest()
    send_notification_request.ttlSeconds = TTL_SECONDS

    # Set priority of the notification so notifications are still received while in power saver
    send_notification_request.priority = 1 if notification.severity == common_pb2.Alert.FATAL else 0

    # Set the title to be the collapse key so notifications about same alert get grouped together
    send_notification_request.collapseKey = notification.title
    splapp_notification = build_splapp_notification(notification)

    payload = encrypt(splapp_notification.SerializeToString())

    build_unsigned_envelope(send_notification_request.signedEnvelope, payload, recipient, sender)

    return send_notification_request


def build_unsigned_envelope(signed_envelope, message, recipient, sender):
    """
    Takes a signed envelope, a serialized message payload and a recipient and then populates the signed envelope
    with sender, recipient fields as well as setting the message payload.

    Important: Does not generate signature because method for signature generation 
    depends on context has access to sign private key

    :param signed_envelope: SendNotificationRequest.signedEnvelope proto
    :param message: envelope.NotificationMessage Proto
    :param recipient: String representing id of the recipient
    :return: void (populates the signed envelope proto)
    """
    notification_message = http_pb2.NotificationMessage()
    notification_message.to = recipient
    notification_message.sender = sender
    notification_message.payload = message

    serialized = notification_message.SerializeToString()

    signed_envelope.messageType = sb_common_pb2.SignedEnvelope.MESSAGE_TYPE_NOTIFICATION_MESSAGE
    signed_envelope.serialized = serialized


def build_splapp_notification(notification):
    """
    Takes a notification object and  returns a notification message object whose alertNotification field is the
    input notification object
    :param notification:
    :return:  NotificationMessage
    """
    notification_message = envelope_pb2.NotificationMessage()
    notification.set_protobuf(notification_message.alertNotification)
    return notification_message
