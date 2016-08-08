#!/usr/bin/env python
# coding:utf-8

import tornado.websocket
import tornado.web

from geveze.base.request_handlers import BaseHandler


# noinspection PyAbstractClass
class BaseWebSocketHandler(BaseHandler, tornado.websocket.WebSocketHandler):
    def __init__(self, application, request, **kwargs):
        super(BaseWebSocketHandler, self).__init__(application, request, **kwargs)
