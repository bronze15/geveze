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


# noinspection PyAbstractClass,PyAbstractClass
class LoginHandler(BaseRequestHandler):
    def get(self, *args, **kwargs):
        self.render('login.html', next=self.request.arguments['next'][0])

    def post(self, *args, **kwargs):
        next_uri = self.request.arguments['next'][0]
        username = self.request.arguments['username'][0]
        self.set_cookie('username', username)
        self.redirect(url=next_uri)
