#!/usr/bin/env python
# coding:utf-8
import tornado.web


# noinspection PyAbstractClass
class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        return True  # TODO FIXME
