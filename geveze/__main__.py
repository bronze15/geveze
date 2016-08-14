#!/usr/bin/env python
# coding:utf-8

from __future__ import print_function

import os

import tornado
import tornado.httpserver
import tornado.ioloop
from tornado.options import define, parse_command_line, options
from tornado.web import url

from geveze.apps.chat.handlers import ChatHandler
from geveze.apps.video.handlers import VideoEchoHandler
from geveze.handlers.request import MainHandler, LoginHandler, FreshFileHandler


class TornadoApp(tornado.web.Application):
    def __init__(self, handlers, **settings):
        super(TornadoApp, self).__init__(handlers=handlers, **settings)


class TornadoChatApp(TornadoApp):
    @property
    def rooms(self):
        return self.__rooms

    def __init__(self, handlers, **settings):
        self.__rooms = dict()
        super(TornadoChatApp, self).__init__(handlers=handlers, **settings)


def server_factory(application, xheaders=True):
    return tornado.httpserver.HTTPServer(application, xheaders=xheaders)


def videochat_appfactory():
    settings = dict(
        static_path=os.path.join(os.path.dirname(__file__), "..", "static"),
    )

    handlers = [
        (r'/ws', VideoEchoHandler),
    ]

    return TornadoApp(handlers=handlers, **settings)


def chatapp_factory():
    settings = {
        'autoreload': options.autoreload,
        'debug': options.debug,
        'compress_response': False,
        'serve_traceback': True,
        'template_path': os.path.join(os.path.dirname(__file__), "..", "templates"),
        'static_path': os.path.join(os.path.dirname(__file__), "..", "static"),
        "login_url": "/login",
    }

    handlers = [
        (r"/", MainHandler),
        (r'/ws', VideoEchoHandler),
        (r"/login", LoginHandler),
        url(r"/rooms/?(?P<room>[0-9]{4,})/ws?", ChatHandler, name="room_ws"),
    ]

    return TornadoChatApp(handlers=handlers, **settings)


if __name__ == "__main__":
    define("compiled_template_cache", default=True)
    define("gzip", default=True, help="compress_response")
    define("autoreload", default=False)
    define("debug", default=False)

    parse_command_line()

    ChatApp = chatapp_factory()
    VideoChatApp = videochat_appfactory()

    chat_server = server_factory(application=ChatApp, xheaders=True)
    chat_server.bind(8888)
    chat_server.start(num_processes=1)

    # schema_server = server_factory(application=VideoChatApp, xheaders=False)
    # schema_server.bind(8000)
    # schema_server.start(num_processes=1)

    tornado.ioloop.IOLoop.current().start()
