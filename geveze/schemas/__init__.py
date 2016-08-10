#!/usr/bin/env python
# coding:utf-8

from jsl import Document

from jsl.fields import (
    OneOfField,
    StringField,
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
    image = UriField(required=True)


class VideoMessage(Document):
    type = StringField(enum=['video'], required=True)
    description = StringField(required=False, description=None)
    video = UriField(required=True)


class AudioMessage(Document):
    type = StringField(enum=['audio'], required=True)
    description = StringField(required=False)
    audio = UriField(required=True)


class PdfMessage(Document):
    type = StringField(enum=['pdf'], required=True)
    description = StringField(required=False)
    document = UriField(required=True)


class AvatarInfoEvent(Document):
    type = StringField(enum=['avatar', 'avatar_change'], required=True)
    src = StringField(required=True)


class JoinedEvent(Document):
    type = StringField(enum=['subscribed'], required=True)
    user = StringField(pattern='^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-'
                               '[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                       required=True)


class LeftEvent(Document):
    type = StringField(enum=['unsubscribed'], required=True)
    user = StringField(pattern='^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-'
                               '[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$',
                       required=True)


class RoomInfo(Document):
    type = StringField(enum=['log', 'online_users'], required=True)
