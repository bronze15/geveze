#!/usr/bin/env python
# coding:utf-8
# noinspection PyCompatibility
import enum


class MessageTypeEnums(enum.Enum):
    subscribed = 10
    unsubscribed = 20
    avatar = 40
    avatar_change = 41

    plain = 30
    photo = 31
    video = 32
    pdf = 33
    file = 34

    room = 50
    online_users = 51
    room_history = 52
