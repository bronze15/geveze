#!/usr/bin/env python
# coding:utf-8

import tornado.websocket
from tornado.util import PY3

from geveze.base.request_handlers import BaseHandler

if PY3:
    # noinspection PyCompatibility
    from urllib.parse import urlparse  # py2

    # noinspection PyShadowingBuiltins
    xrange = range
else:
    # noinspection PyCompatibility
    from urlparse import urlparse  # py3


# noinspection PyAbstractClass
class BaseWebSocketHandler(BaseHandler, tornado.websocket.WebSocketHandler):
    CORS_ORIGINS = []

    def __init__(self, application, request, **kwargs):
        super(BaseWebSocketHandler, self).__init__(application, request, **kwargs)

    def check_origin(self, origin):
        parsed_origin = urlparse(origin)
        # parsed_origin.netloc.lower() gives localhost:3333
        return parsed_origin.hostname in self.CORS_ORIGINS
