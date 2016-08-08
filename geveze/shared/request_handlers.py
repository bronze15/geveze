#!/usr/bin/env python
# coding:utf-8
import tornado.web

from geveze.base.request_handlers import BaseHandler


# noinspection PyAbstractClass
class BaseRequestHandler(BaseHandler, tornado.web.RequestHandler):
    def __init__(self, application, request, **kwargs):
        super(BaseRequestHandler, self).__init__(application, request, **kwargs)
