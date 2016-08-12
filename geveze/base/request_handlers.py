#!/usr/bin/env python
# coding:utf-8
import tornado.web


# noinspection PyAbstractClass
class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        return self.get_cookie('username') is not None
        return False  # TODO FIXME
