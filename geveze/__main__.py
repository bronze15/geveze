#!/usr/bin/env python
# coding:utf-8

from __future__ import print_function

import os

import tornado
import tornado.httpserver
import tornado.ioloop
from tornado.options import define, parse_command_line

from geveze.handlers.request import MainHandler
from geveze.handlers.websocket import ChatHandler, Room


class User(object):
    @property
    def prefs(self):
        return None


class TornadoChatApp(tornado.web.Application):
    @property
    def rooms(self):
        return self.__rooms

    def __init__(self, handlers, **settings):
        self.__rooms = [Room()]
        super(TornadoChatApp, self).__init__(handlers=handlers, **settings)


def server_factory(application, xheaders=True):
    server = tornado.httpserver.HTTPServer(application, xheaders=xheaders)
    return server


def chat_app_factory():
    define("compiled_template_cache", default=True)
    define("gzip", default=True, help="compress_response")
    parse_command_line()

    settings = {
        'autoreload': True,
        'debug': True,
        'compress_response': True,
        'serve_traceback': True,
        'template_path': os.path.join(os.path.dirname(__file__), "..", "templates"),
        'static_path': os.path.join(os.path.dirname(__file__), "..", "static"),
        "login_url": "/login",
    }

    handlers = [
        (r"/", MainHandler),
        (r"/chat", ChatHandler),
    ]

    return TornadoChatApp(handlers=handlers, **settings)


if __name__ == "__main__":
    App = chat_app_factory()
    server = server_factory(application=App, xheaders=True)
    server.bind(8888)
    server.start(num_processes=1)
    tornado.ioloop.IOLoop.current().start()
