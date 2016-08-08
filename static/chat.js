// Copyright 2009 FriendFeed
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

/*
    todo fixme
    business logic
    1. reconnect to websocket on close
    
* */
$(document).ready(function() {
    if (!window.console) window.console = {};
    if (!window.console.log) window.console.log = function() {};

    $("#messageform").on("submit", function() {
        send($(this));
        return false;
    });
    $("#messageform").on("keypress", function(e) {
        if (e.keyCode == 13) {
            send($(this));
            return false;
        }
    });
    // $("#message").select(); // for mobile debugging UX, disable focus
    updater.start();
});

function send(form) {
    var message = form.formToDict();
    if (message.body === "") return;
    message.date = new Date().getTime();
    message.type = "message";
    updater.socket.send(JSON.stringify(message));

    form.find("input[type=text]").val("").select();
}

jQuery.fn.formToDict = function() {
    var fields = this.serializeArray();
    var json = {};
    for (var i = 0; i < fields.length; i++) {
        json[fields[i].name] = fields[i].value;
    }
    if (json.next) delete json.next;
    return json;
};


var DOM = {
    info: (message) => {

        let el = document.createElement("div");
        let time = document.createElement("time");
        let messageBody = document.createElement("span");
        let avatar = document.createElement("img");

        let messageTime = new Date().toTimeString().slice(0, 8);

        time.setAttribute("datetime", messageTime);

        el.setAttribute("data-sent", messageTime);
        el.classList.add("info", message.type);

        let avatarUrl = localStorage.getItem(message.user.uuid);
        if (avatarUrl !== null) {
            avatar.setAttribute('src', avatarUrl);
        } else {
            avatar.setAttribute('src', new Avatar().placeholder());
        }

        avatar.classList.add("avatar", message.type);
        messageBody.innerText = message.body;

        el.appendChild(avatar);
        el.appendChild(time);
        el.appendChild(messageBody);


        return el;

    },
    message: (message) => {

        let el = document.createElement("div");
        let time = document.createElement("time");
        let messageBody = document.createElement("span");
        let avatar = new Avatar().avatarElement();
        let messageTime = new Date(message.timestamp).toTimeString().slice(0, 8);

        messageBody.innerHTML = message.body;

        time.setAttribute("datetime", messageTime);

        el.classList.add("message");

        el.setAttribute("message-id", message.id);
        el.setAttribute("data-sent", messageTime);

        el.appendChild(avatar);
        el.appendChild(time);
        el.appendChild(messageBody);

        return el;
    },
};

var SHOW = {
    message: (message) => {


        var existing = $("#message-" + message.id);
        if (existing.length > 0) return;
        // var node = $(message.html);
        let node = $(updater.dom(message));
        node.hide();
        $("#inbox").append(node);
        node.slideDown();

    },
    info: (message) => {

        let node = $(updater.dom(message));
        node.hide();
        $("#inbox").append(node);
        node.slideDown();
    },
};

var updater = {
    socket: null,

    guid: function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },

    start: function() {
        let avatar = new Avatar();
        let guid = avatar.myGuid();


        var url = `wss://${location.host}/chat?uuid=${guid}`;

        updater.socket = new WebSocket(url);

        updater.socket.onopen = (evt) => {

            let avatarJsonData = {
                type: "avatar",
                guid: guid,
                avatar: avatar.avatarUrl()
            };

            console.info("Connection Opened");
            updater.socket.send(JSON.stringify(avatarJsonData));

        };

        updater.socket.onmessage = function(event) {

            let message = JSON.parse(event.data);
            console.log(message);

            switch (message.type) {
                case "join":
                case "leave":
                    SHOW.info(message);
                    return;
                case "message":
                    SHOW.message(message);
                    return;
                case "avatar":
                    localStorage.setItem(message.guid, message.avatar);
                    break;
                default:
                    break;
            };
        }
    },

    dom: function(message) {
        switch (message.type) {
            case "join":
            case "leave":
                return DOM.info(message);
                break;
            case "message":
                return DOM.message(message);
                break;
            default:
                break;
        }

    }
};
