#!/usr/bin/env python
# coding:utf-8
import tornado.web

from geveze.handlers.websocket_handlers import ChatHandler
from geveze.shared.request_handlers import BaseRequestHandler


# noinspection PyAbstractClass
class MainHandler(BaseRequestHandler):
    """
    TODO: localization
    """

    @tornado.web.authenticated
    def get(self):
        self.render('index.html', messages=ChatHandler.cache)
