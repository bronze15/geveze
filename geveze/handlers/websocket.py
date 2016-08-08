#!/usr/bin/env python
# coding:utf-8
import datetime

import tornado.escape
# noinspection PyCompatibility
import enum
from ua_parser import user_agent_parser
import collections
from geveze.base.websocket_handlers import BaseWebSocketHandler
import logging


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
        self.parse_request_args(handler)
        self.parse_useragent()

    def parse_request_headers(self, handler):
        # noinspection PyProtectedMember
        self.info['ip'] = handler.request.headers._dict.get('X-Forwarded-For')
        # noinspection PyProtectedMember
        self.info['user-agent'] = handler.request.headers._dict.get('User-Agent')

    def parse_request_args(self, handler):
        self.info['uuid'] = handler.request.arguments["uuid"][0]

    @property
    def uuid(self):
        return self.info['uuid']

    @property
    def info(self):
        return self.__info

    @property
    def useragent_info(self):
        return self.__useragent_info

    @property
    def short_device_info(self):
        return dict(
            device=self.useragent_info['device']['family'],
            os=self.useragent_info['os']['family'],
            browser=self.useragent_info['user_agent']
        )

    def parse_useragent(self):
        self.__useragent_info = user_agent_parser.Parse(self.info['user-agent'])

    def __init__(self, handler):
        self.__info = dict()
        self.__useragent_info = dict()
        self.handler = handler


class Room(object):
    def update_cache(self, data):
        self.cache.append(data)

        log = "updated cache with {data}".format(data=data)
        logging.debug(log)

    @property
    def cache(self):
        return self.__cache

    def __init__(self, cache_size=10):
        self.__cache = collections.deque(maxlen=cache_size)
        self.subscribers = dict()  # collections.deque(maxlen=3) :))

    # noinspection PyMethodMayBeStatic
    def broadcast(self, sender, data):
        message = tornado.escape.json_decode(data)
        log = "{sender} sent a message in: {type}".format(sender=sender.subscriber.uuid, type=message['type'])
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
    def open(self):
        self.room = self.application.rooms[0]
        self.room.subscribe(handler=self, subscriber=self.subscriber)

    def on_message(self, message):
        self.room.broadcast(sender=self, data=message)

    def on_connection_close(self):
        self.room.unsubscribe(subscriber=self.subscriber)

    def on_close(self):
        pass
