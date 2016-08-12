#!/usr/bin/env python
# coding:utf-8
# noinspection PyCompatibility
import enum


class ClientEvents(enum.Enum):
    send_avatar = 10
    get_avatars = 11
    get_onlineusers = 12

    send_text = 20
    send_image = 21
    send_video = 22
    send_audio = 23
    send_pdf = 24
    send_file = 25


class ServerEvents(enum.Enum):
    subscribed = 0
    unsubscribed = 1
    send_uuid = 2

    send_avatars = 10
    send_avatar = 11

    send_text = 20
    send_image = 21
    send_video = 22
    send_audio = 23
    send_pdf = 24
    send_file = 25

    send_onlineusers = 30


class MessageTypeEnums(enum.Enum):
    subscribed = 10
    notify_uuid = 11
    unsubscribed = 20
    avatar = 40
    avatar_change = 41

    plain = 30
    image = 31
    video = 32
    audio = 33
    pdf = 34
    file = 35

    room = 50
    online_users = 51
    room_history = 52
    avatars = 53
