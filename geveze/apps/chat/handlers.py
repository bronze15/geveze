#!/usr/bin/env python
# coding:utf-8
import tornado.escape
import tornado.web

from geveze.apps.chat import Subscriber, Room
from geveze.base.websocket_handlers import BaseWebSocketHandler
from geveze.shared.request_handlers import BaseRequestHandler


# noinspection PyAbstractClass
class RoomHandler(BaseRequestHandler):
    @tornado.web.authenticated
    def get(self, room):
        self.render('room.html', room=room)


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
