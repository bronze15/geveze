#!/usr/bin/env python
# coding:utf-8
import tornado.web

from geveze.shared.request_handlers import BaseRequestHandler


# noinspection PyAbstractClass
class MainHandler(BaseRequestHandler):
    """
    TODO: localization
    """

    @tornado.web.authenticated
    def get(self):
        self.render('index.html')


# noinspection PyAbstractClass
class RoomHandler(BaseRequestHandler):
    @tornado.web.authenticated
    def get(self, room):
        self.render('room.html', room=room)