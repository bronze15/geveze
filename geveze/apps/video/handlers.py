#!/usr/bin/env python
# coding:utf-8
import logging
import sys

from geveze.base.websocket_handlers import BaseWebSocketHandler


# noinspection PyAbstractClass
class VideoEchoHandler(BaseWebSocketHandler):
    CORS_ORIGINS = ['localhost', '7a6907b0.ngrok.io']

    connections = set()

    def open(self, *args, **kwargs):
        VideoEchoHandler.connections.add(self)

        msg = 'connection opened. total:{total}'.format(total=VideoEchoHandler.connections.__len__())
        logging.debug(msg=msg)

    def on_message(self, message):
        logging.info('message came with {0} KB'.format(sys.getsizeof(message)/1024.0))
        # watchers = [_ for _ in VideoEchoHandler.connections if _ is not self]
        watchers = [_ for _ in VideoEchoHandler.connections if _ is self]
        for _ in watchers:
            _.write_message(message=message, binary=True)

    def on_connection_close(self):
        VideoEchoHandler.connections.remove(self)
        msg = 'connection closed. total:{total}'.format(total=VideoEchoHandler.connections.__len__())
        logging.debug(msg=msg)

    def on_close(self):
        VideoEchoHandler.connections.remove(self)
        msg = '*** connection closed. total:{total}'.format(total=VideoEchoHandler.connections.__len__())
        logging.debug(msg=msg)
