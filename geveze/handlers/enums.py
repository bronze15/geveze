#!/usr/bin/env python
# coding:utf-8
# noinspection PyCompatibility
import enum


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
