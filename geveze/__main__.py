#!/usr/bin/env python
# coding:utf-8

from __future__ import print_function

import os

import tornado.escape
import tornado.ioloop
import tornado.template
import tornado.web
import tornado.websocket

from geveze.handlers.request_handlers import MainHandler
from geveze.handlers.websocket_handlers import ChatHandler


class User(object):
    @property
    def prefs(self):
        return None




def app_factory():
    settings = {
        'autoreload': True,
        'debug': True,
        'compress_response': True,
        'serve_traceback': True,
        'template_path': os.path.join(os.path.dirname(__file__), "..", "templates"),
        'static_path': os.path.join(os.path.dirname(__file__), "..", "static"),
        "login_url": "/login",
    }
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/chat", ChatHandler),
    ], **settings)


if __name__ == "__main__":
    App = app_factory()
    App.listen(8888)
    tornado.ioloop.IOLoop.current().start()
