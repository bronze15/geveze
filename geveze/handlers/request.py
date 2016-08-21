#!/usr/bin/env python
# coding:utf-8
import tornado.web

from geveze.shared.request_handlers import BaseRequestHandler


# noinspection PyAbstractClass
class FreshFileHandler(tornado.web.StaticFileHandler):
    def set_extra_headers(self, path):
        # Disable cache
        self.set_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')

    def get(self, *args, **kwargs):
        return super(FreshFileHandler, self).get(*args, **kwargs)


# noinspection PyAbstractClass
class MainHandler(BaseRequestHandler):
    """
    TODO: localization
    """

    @tornado.web.authenticated
    def get(self):
        self.redirect('/static/video.html', permanent=False)


# noinspection PyAbstractClass,PyAbstractClass
class LoginHandler(BaseRequestHandler):
    def get(self, *args, **kwargs):
        self.render('login.html', next=self.request.arguments['next'][0])

    def post(self, *args, **kwargs):
        next_uri = self.request.arguments['next'][0]
        username = self.request.arguments['username'][0]
        self.set_cookie('username', username)
        self.redirect(url=next_uri)
