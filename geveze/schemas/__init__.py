#!/usr/bin/env python
# coding:utf-8

from jsl import Document

from jsl.fields import (
    OneOfField,
    StringField,
    ArrayField,
    UriField
)

MessageTypes = dict(
    plain=StringField(enum=['plain']),
    image=StringField(enum=['image']),
    video=StringField(enum=['video']),
    audio=StringField(enum=['audio']),
    file=StringField(enum=['file']),
    pdf=StringField(enum=['pdf']),
)


class Message(Document):
    type = OneOfField(fields=MessageTypes.values(), required=True)


class PlainMessage(Document):
    type = StringField(enum=['plain'], required=True)
    body = StringField(required=True)


class PhotoMessage(Document):
    type = StringField(enum=['image'], required=True)
    description = StringField(required=False)
    images = ArrayField(UriField(), min_items=1, max_items=10, unique_items=True, required=True)


class VideoMessage(Document):
    type = StringField(enum=['video'], required=True)
    description = StringField(required=False, description='asdasd')
    videos = ArrayField(UriField(), min_items=1, max_items=1, required=True)


class AudioMessage(Document):
    type = StringField(enum=['audio'], required=True)
    description = StringField(required=False)
    audios = ArrayField(UriField(), min_items=1, max_items=1, required=True)


class PdfMessage(Document):
    type = StringField(enum=['pdf'], required=True)
    document = UriField()
