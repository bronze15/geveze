#!/usr/bin/env python
# coding:utf-8

from __future__ import print_function

import datetime
import logging
import os
import uuid

import tornado.escape
import tornado.ioloop
import tornado.template
import tornado.web
import tornado.websocket


class User(object):
    @property
    def prefs(self):
        return None


# noinspection PyAbstractClass
class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        return True  # TODO FIXME


# noinspection PyAbstractClass
class BaseWebSocketHandler(BaseHandler, tornado.websocket.WebSocketHandler):
    def __init__(self, application, request, **kwargs):
        super(BaseWebSocketHandler, self).__init__(application, request, **kwargs)


# noinspection PyAbstractClass
class BaseRequestHandler(BaseHandler, tornado.web.RequestHandler):
    def __init__(self, application, request, **kwargs):
        super(BaseRequestHandler, self).__init__(application, request, **kwargs)


# noinspection PyAbstractClass
class MainHandler(BaseRequestHandler):
    """
    TODO: localization
    """

    @tornado.web.authenticated
    def get(self):
        self.render('index.html', messages=ChatHandler.cache)


# noinspection PyAbstractClass
class ChatHandler(BaseWebSocketHandler):
    """
    https://github.com/tornadoweb/tornado/blob/master/demos/websocket/chatdemo.py

    """
    waiters = dict()
    cache = []
    cache_size = 200

    def get_compression_options(self):
        # Non-None enables compression with default options.
        return {}

    # noinspection PyAttributeOutsideInit,PyProtectedMember
    def open(self, *args, **kwargs):
        # TODO. ChatHandler.waiters.has_key ile yeni sekmede açtı kontrolü
        self.user_uuid = self.request.arguments["uuid"][0]

        data = dict(type="join")

        try:
            self.user_ip = self.request.headers._dict['X-Forwarded-For']
        except:
            self.user_ip = None

        self.user_agent = self.request.headers._dict['User-Agent']

        data["body"] = u"{user} konuşmaya katıldı.".format(user=self.user_uuid)
        data["user"] = self.user_data
        data['id'] = str(uuid.uuid4())
        data['date'] = datetime.datetime.now().__str__()

        data_self = data.copy()

        if ChatHandler.waiters.has_key(self.user_uuid):
            del ChatHandler.waiters[self.user_uuid]
            data_self['body'] = u'Yeni bir sekmede konuşmaya katıldınız.'
            data["body"] = u"{user} yeni bir sekmede konuşmaya katıldı.".format(user=self.user_uuid)

        else:
            data_self['body'] = u'Konuşmaya katıldınız'

        self.write_message(data_self)
        ChatHandler.update_cache(data)

        ChatHandler.send_updates(data)
        ChatHandler.waiters[self.user_uuid] = self

    @property
    def user_data(self):
        return dict(
            uuid=self.user_uuid,
            agent=self.user_agent,
            ip=self.user_ip)

    def on_message(self, message):
        # logging.info("got message %r", message) #TODO
        parsed = tornado.escape.json_decode(message)
        chat = dict()

        if parsed.get("type") in ("avatar", "join"):
            chat = parsed
            chat['id'] = str(uuid.uuid4())
            chat['user'] = self.user_data

        elif parsed.get("type") == "message":
            chat = dict(
                type="message",
                id=str(uuid.uuid4()),
                date=datetime.datetime.fromtimestamp(parsed['date'] / 1000.0).__str__(),
                timestamp=parsed['date'],
                user=self.user_data,
                body=tornado.escape.linkify(
                    text=parsed["body"],
                    shorten=False,
                    extra_params='rel="nofollow" class="external" target="_blank"',
                    permitted_protocols=['http', 'https', 'mailto', 'intent']))

        ChatHandler.update_cache(chat)
        ChatHandler.send_updates(chat)

    @classmethod
    def update_cache(cls, chat):
        # TODO FIXME
        # return
        cls.cache.append(chat)
        if len(cls.cache) > cls.cache_size:
            cls.cache = cls.cache[-cls.cache_size:]

    @classmethod
    def send_updates(cls, chat):
        logging.info("sending message to %d waiters", len(cls.waiters))
        for k, v in cls.waiters.iteritems():
            waiter = v
            try:
                waiter.write_message(chat)
            except WebSocketClosedError as e:
                # TODO: reconnect
                logging.error("Error sending message", exc_info=True)
            except:
                raise

    def on_connection_close(self):
        # TODO ?? on_close or on_connection_close !!
        self.on_close()

    def on_close(self):
        if ChatHandler.waiters.has_key(self.user_uuid):
            del ChatHandler.waiters[self.user_uuid]

        data = dict(type="leave")
        msg = u"{user} konuşmadan ayrıldı.".format(user=self.user_uuid)
        data['body'] = msg
        data['user'] = self.user_data

        ChatHandler.update_cache(data)
        ChatHandler.send_updates(data)


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
