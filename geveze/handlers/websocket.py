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
import time


class Events(enum.Enum):
    joined = 10
    joined_first = 11
    joined_again = 12
    joined_newtab = 13

    left = 20
    closed_tab = 21
    fired = 22

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
        self.handler.write_message(message=json_data)

    def __init__(self, handler):
        self.__info = dict(uuid=uuid.uuid4().__str__())
        self.handler = handler


class Room(object):
    # noinspection PyUnusedLocal
    def update_message_cache(self, message):
        self.cache.append(message)
        log = "room: {room} total: {total} updated cache from: {sender} id:{uuid}".format(
            sender=message['sender'],
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

    def subscribe(self, subscriber):
        subscriber.parse_info()
        self.subscribers[subscriber.uuid] = subscriber
        log = "{e} subscribed. Total {count} subscriber".format(
            e=subscriber.uuid,
            count=self.subscribers.keys().__len__())
        logging.debug(log)

        self.emit(sender=subscriber, data=dict(type="room", action='subscribe'))

    def unsubscribe(self, subscriber):
        del self.subscribers[subscriber.uuid]
        # TODO notify and close remotely web socket connection here

        log = "{e} unsubscribed. Total {count} subscriber".format(
            e=subscriber.uuid,
            count=self.subscribers.keys().__len__())
        logging.debug(log)

        self.emit(sender=subscriber, data=dict(type="room", action='unsubscribe'))

    # noinspection PyMethodMayBeStatic
    def emit(self, sender, data):
        data['uuid'] = uuid.uuid4().__str__()
        data['sender'] = sender.uuid
        data['time'] = time.time() * 1000.0
        data['date'] = datetime.datetime.now().__str__()
        self.update_message_cache(message=data)
        if data.get('type') is None:
            pass
        log = "{sender} sent a data in: {type}".format(
            sender=sender.uuid,
            type=data.get('type'))
        logging.debug(log)

        for sender in self.subscribers.values():
            sender.send(json_data=data)


# noinspection PyAbstractClass
class ChatHandler(BaseWebSocketHandler):
    def on_message(self, message):
        self.room.emit(sender=self.subscriber, data=tornado.escape.json_decode(message))

    def __init__(self, *args, **kwargs):
        self.subscriber = Subscriber(handler=self)
        super(ChatHandler, self).__init__(*args, **kwargs)

    # noinspection PyAttributeOutsideInit,PyProtectedMember,PyShadowingBuiltins
    def open(self, room):
        if room not in self.application.rooms:
            self.application.rooms[room] = Room(room_id=room)

        self.room = self.application.rooms[room]
        self.room.subscribe(subscriber=self.subscriber)

    def on_connection_close(self):
        self.room.unsubscribe(subscriber=self.subscriber)

    def on_close(self):
        pass
