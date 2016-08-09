#!/usr/bin/env python
# coding:utf-8
import tornado.web

import geveze.schemas


# noinspection PyAbstractClass,PyShadowingBuiltins
class MessageSchemaInfoHandler(tornado.web.RequestHandler):
    def get(self, type=None):
        if type == 'plain':
            schema = geveze.schemas.PlainMessage.get_schema(ordered=True)
        elif type == 'photo':
            schema = geveze.schemas.PhotoMessage.get_schema(ordered=True)
        elif type == 'video':
            schema = geveze.schemas.VideoMessage.get_schema(ordered=True)
        elif type == 'audio':
            schema = geveze.schemas.AudioMessage.get_schema(ordered=True)
        elif type == 'pdf':
            schema = geveze.schemas.PdfMessage.get_schema(ordered=True)
        else:
            schema = geveze.schemas.Message.get_schema(ordered=True)
        self.write(schema)
