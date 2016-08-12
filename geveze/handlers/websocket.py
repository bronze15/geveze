#!/usr/bin/env python
# coding:utf-8
import datetime

import tornado.escape
# noinspection PyCompatibility
from geveze.base.websocket_handlers import BaseWebSocketHandler
import logging
import uuid
from geveze.handlers.enums import MessageTypeEnums
from tornado.websocket import WebSocketClosedError


class MessageHelpers(object):
    @staticmethod
    def js2datetime(time):
        return datetime.datetime.fromtimestamp(float(time) / 1000)

    @staticmethod
    def linkify(text):
        return tornado.escape.linkify(
            text=text,
            shorten=False,
            extra_params='rel="nofollow" class="external" target="_blank"',
            permitted_protocols=['http', 'https', 'mailto', 'intent'])


# noinspection PyAbstractClass
class Subscriber(object):
    def parse_info(self):
        # noinspection PyProtectedMember
        self.parse_request_headers(self.handler)

    def parse_request_headers(self, handler):
        # noinspection PyProtectedMember
        self.info['ip'] = handler.request.headers._dict.get('X-Forwarded-For')

    @property
    def uuid(self):
        return self.info.get('uuid')

    @property
    def info(self):
        return self.__info

    def send(self, json_data):
        # self.handler.write_message(message=json_data)

        if self.handler.ws_connection is None:
            raise WebSocketClosedError()
        return self.handler.write_message(json_data, binary=False)

    def __init__(self, handler):
        self.__info = dict(uuid=uuid.uuid4().__str__())
        self.handler = handler


class Room(object):
    @property
    def name(self):
        return self.__name

    def __init__(self, name):
        self.__name = name
        self.subscribers = dict()  # collections.deque(maxlen=3) :))

    def subscribe(self, subscriber):
        subscriber.parse_info()
        self.subscribers[subscriber.uuid] = subscriber
        log = "{user} subscribed. Total {count} subscriber".format(
            user=subscriber.uuid,
            count=self.subscribers.keys().__len__())
        logging.debug(log)

        data = dict(uuid=uuid.uuid4().__str__(), type=MessageTypeEnums.subscribed.name)
        notify_data = data.copy()
        notify_data['type'] = MessageTypeEnums.notify_uuid.name
        notify_data['me'] = subscriber.uuid

        subscriber.send(json_data=notify_data)
        self.emit(sender=subscriber, data=data)

    def unsubscribe(self, subscriber):
        del self.subscribers[subscriber.uuid]
        # TODO notify and close remotely web socket connection here

        log = "{e} unsubscribed. Total {count} subscriber".format(
            e=subscriber.uuid,
            count=self.subscribers.keys().__len__())
        logging.debug(log)

        self.emit(
            sender=subscriber,
            data=dict(
                uuid=uuid.uuid4().__str__(),
                type=MessageTypeEnums.unsubscribed.name))

    def online_users(self, receiver):
        data = dict(
            uuid=uuid.uuid4().__str__(),
            room=dict(
                name=self.name
            ),
            type='online_users',
            users=[k.uuid for k in self.subscribers.values()])
        receiver.send(json_data=data)

    # noinspection PyMethodMayBeStatic
    def emit(self, sender, data):
        try:
            message_type = MessageTypeEnums[data.get('type')]
        except KeyError:
            log = "[!] message from {user} ignored".format(user=sender.uuid, type=data.get('type'))
            logging.debug(log)
            return

        if message_type is MessageTypeEnums.plain:
            data['body'] = MessageHelpers.linkify(data['body'])
        elif message_type is MessageTypeEnums.online_users:
            return self.online_users(receiver=sender)
        else:
            pass

        log = "{sender} sent a data in: {type}".format(
            sender=sender.uuid,
            type=message_type.name)

        logging.debug(log)

        data['sender'] = sender.uuid
        data['date'] = datetime.datetime.now().isoformat()

        for sender in self.subscribers.values():
            sender.send(json_data=data)


# noinspection PyAbstractClass
class ChatHandler(BaseWebSocketHandler):
    CORS_ORIGINS = ['localhost', '7a6907b0.ngrok.io']

    def on_message(self, message):
        self.room.emit(sender=self.subscriber, data=tornado.escape.json_decode(message))

    def __init__(self, *args, **kwargs):
        self.subscriber = Subscriber(handler=self)
        super(ChatHandler, self).__init__(*args, **kwargs)

    # noinspection PyAttributeOutsideInit,PyProtectedMember,PyShadowingBuiltins
    def open(self, room):
        if not self.current_user:
            self.close(403, 'Not authorized. Please login')

        if room not in self.application.rooms:
            self.application.rooms[room] = Room(name=room)

        self.room = self.application.rooms[room]
        self.room.subscribe(subscriber=self.subscriber)

    def on_connection_close(self):
        try:
            self.room.unsubscribe(subscriber=self.subscriber)
        except:
            pass

    def on_close(self):
        pass
