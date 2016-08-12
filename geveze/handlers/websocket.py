#!/usr/bin/env python
# coding:utf-8
import datetime

import tornado.escape
# noinspection PyCompatibility
from geveze.base.websocket_handlers import BaseWebSocketHandler
import logging
import uuid
from geveze.handlers.enums import ClientEvents, ServerEvents
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
    def id(self):
        return id(self)

    @property
    def info(self):
        return self.__info

    def send(self, data):
        if self.handler.ws_connection is None:
            raise WebSocketClosedError()
        return self.handler.write_message(data, binary=False)

    @property
    def avatar(self):
        return self.__avatar

    @avatar.setter
    def avatar(self, value):
        self.__avatar = value

    def __init__(self, handler):
        self.__info = dict(
            uuid=uuid.uuid4().__str__(),
            joined=datetime.datetime.now().isoformat())
        self.__avatar = None
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
        self.broadcast2(subscriber=subscriber, data=dict(type=ServerEvents.send_uuid.name, uuid=subscriber.uuid))
        log = "{user} subscribed. Total {count} subscriber".format(
            user=subscriber.uuid,
            count=self.subscribers.keys().__len__())
        logging.debug(log)

    def unsubscribe(self, subscriber):
        del self.subscribers[subscriber.uuid]
        # TODO notify and close remotely web socket connection here

        log = "{e} unsubscribed. Total {count} subscriber".format(
            e=subscriber.uuid,
            count=self.subscribers.keys().__len__())
        logging.debug(log)

    # noinspection PyUnusedLocal
    def broadcast2all(self, sender, data):
        for sender in self.subscribers.values():
            sender.send(data=data)

    # noinspection PyMethodMayBeStatic
    def broadcast2(self, subscriber, data):
        subscriber.send(data=data)

    # noinspection PyMethodMayBeStatic
    def message_broker(self, sender, data):
        _type = data['type']
        data['sender'] = sender.uuid
        data['date'] = datetime.datetime.now().isoformat()

        try:
            message_type = ClientEvents[_type]
        except KeyError:
            log = "[!] message from {user} ignored".format(user=data['sender'], type=_type)
            logging.warn(log)
            return

        if message_type is ClientEvents.get_avatars:
            for _ in self.subscribers.values():
                data = dict(type=ServerEvents.send_avatars.name,
                            avatars={k: self.subscribers[k].avatar for k in self.subscribers.keys()})
                self.broadcast2(
                    subscriber=sender,
                    data=data)
            return
        if message_type is ClientEvents.send_text:
            data['body'] = MessageHelpers.linkify(data['body'])
            return self.broadcast2all(sender=sender, data=data)

        elif message_type is ClientEvents.send_avatar:
            sender.avatar = data['src']
            return self.broadcast2all(sender=sender, data=data)

        elif message_type is ClientEvents.get_onlineusers:
            data.update(
                dict(
                    online_users=[k for k in self.subscribers.keys()],
                    type=ServerEvents.send_onlineusers.name
                ))
            return self.broadcast2(subscriber=sender, data=data)

        else:
            raise KeyError("Unknown message type: %s" % message_type)


# noinspection PyAbstractClass
class ChatHandler(BaseWebSocketHandler):
    CORS_ORIGINS = ['localhost', '7a6907b0.ngrok.io']

    def __init__(self, *args, **kwargs):
        self.subscriber = Subscriber(handler=self)
        super(ChatHandler, self).__init__(*args, **kwargs)

    # noinspection PyAttributeOutsideInit,PyProtectedMember,PyShadowingBuiltins,PyUnusedLocal
    def open(self, room):
        if not self.current_user:
            self.close(403, 'Not authorized. Please login')

        if room not in self.application.rooms:
            self.application.rooms[room] = Room(name=room)

        self.room = self.application.rooms[room]
        self.room.subscribe(subscriber=self.subscriber)

    def on_message(self, message):
        try:
            data = tornado.escape.json_decode(message)
        except ValueError as e:  # malformed json or non-json data
            return self.close(code=None, reason='malformed json or non-json data')

        self.room.message_broker(sender=self.subscriber, data=data)

    def on_connection_close(self):
        try:
            self.room.unsubscribe(subscriber=self.subscriber)
        except:
            pass

    def on_close(self):
        pass
