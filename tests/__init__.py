#!/usr/bin/env python
# coding:utf-8

import json
import unittest

import websocket

websocket.enableTrace(False)


# noinspection PyMethodParameters
class GevezeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.encoder = json.JSONEncoder()
        cls.decoder = json.JSONDecoder()
        cls.URL = "ws://localhost:8888/rooms/1000"

    def setUp(self):
        self.data = dict(type="test")
        self.message_data = self.encoder.encode(self.data)

    def test_message_bomb(self):
        ws = websocket.WebSocket()
        ws.connect(self.URL)
        for _ in range(10):
            ws.send(self.message_data)


if __name__ == '__main__':
    unittest.main()
