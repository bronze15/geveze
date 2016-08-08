#!/usr/bin/env python
# coding:utf-8
import datetime

import tornado.escape
# noinspection PyCompatibility
import enum
import collections
from geveze.base.websocket_handlers import BaseWebSocketHandler
import logging
import uuid


class Events(enum.Enum):
    joined = 10
    joined_first = 11
    joined_again = 12
    joined_newtab = 13

    left = 20
    closed_tab = 21

    sent_message = 30
    sent_photo = 31
    sent_video = 32
    sent_audio = 33
    sent_file = 34

    avatar = 40
    sent_avatar_info = 41
    changed_avatar = 42


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
    def parse_info(self, handler):
        # noinspection PyProtectedMember
        self.parse_request_headers(handler)

    def parse_request_headers(self, handler):
        # noinspection PyProtectedMember
        self.info['ip'] = handler.request.headers._dict.get('X-Forwarded-For')

    @property
    def uuid(self):
        return self.info.get('uuid')

    @property
    def info(self):
        return self.__info

    def __init__(self, handler):
        self.__info = dict(uuid=uuid.uuid4().__str__())
        self.handler = handler


class Room(object):
    # noinspection PyUnusedLocal
    def update_message_cache(self, sender, message):
        message['uuid'] = uuid.uuid4()
        self.cache.append(message)
        log = "room: {room} total: {total} updated cache from: {sender} id:{uuid}".format(
            sender=sender.subscriber.uuid,
            uuid=message['uuid'],
            total=self.cache.__len__(),
            room=self.room_id)
        logging.debug(log)

    @property
    def cache(self):
        return self.__cache

    @property
    def room_id(self):
        return self.__room_id

    def __init__(self, room_id, cache_size=10):
        self.__room_id = room_id
        self.__cache = collections.deque(maxlen=cache_size)
        self.subscribers = dict()  # collections.deque(maxlen=3) :))

    def message(self, sender, data):
        message = tornado.escape.json_decode(data)
        self.update_message_cache(sender=sender, message=message)
        return message

    # noinspection PyMethodMayBeStatic
    def broadcast(self, sender, data):
        message = self.message(sender=sender, data=data)
        log = "{sender} sent a message in: {type}".format(sender=sender.subscriber.uuid, type=message.get('type'))
        logging.debug(log)

    def subscribe(self, handler, subscriber):
        subscriber.parse_info(handler=handler)
        self.subscribers[subscriber.uuid] = subscriber

        log = "{e} subscribed. Total {count} subscriber".format(
            e=subscriber.uuid,
            count=self.subscribers.keys().__len__())
        logging.debug(log)

    def unsubscribe(self, subscriber):
        del self.subscribers[subscriber.uuid]
        # TODO notify and close remotely web socket connection here

        log = "{e} unsubscribed. Total {count} subscriber".format(
            e=subscriber.uuid,
            count=self.subscribers.keys().__len__())
        logging.debug(log)


# noinspection PyAbstractClass
class ChatHandler(BaseWebSocketHandler):
    """
    https://github.com/tornadoweb/tornado/blob/master/demos/websocket/chatdemo.py
    """

    def __init__(self, *args, **kwargs):
        self.subscriber = Subscriber(handler=self)
        super(ChatHandler, self).__init__(*args, **kwargs)

    # noinspection PyAttributeOutsideInit,PyProtectedMember
    def open(self, *args, **kwargs):
        self.room = self.application.rooms[0]
        self.room.subscribe(handler=self, subscriber=self.subscriber)

    def on_message(self, message):
        self.room.broadcast(sender=self, data=message)

    def on_connection_close(self):
        self.room.unsubscribe(subscriber=self.subscriber)

    def on_close(self):
        pass


# noinspection PyAbstractClass
class GevezeChatHandler(BaseWebSocketHandler):
    def on_message(self, message):
        self.room.broadcast(sender=self, data=message)

    def __init__(self, *args, **kwargs):
        self.subscriber = Subscriber(handler=self)
        super(GevezeChatHandler, self).__init__(*args, **kwargs)

    # noinspection PyAttributeOutsideInit,PyProtectedMember,PyShadowingBuiltins
    def open(self, room):
        if room not in self.application.rooms:
            self.application.rooms[room] = Room(room_id=room)

        self.room = self.application.rooms[room]
        self.room.subscribe(handler=self, subscriber=self.subscriber)

    def on_connection_close(self):
        self.room.unsubscribe(subscriber=self.subscriber)

    def on_close(self):
        pass
