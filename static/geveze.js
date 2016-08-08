var socket = null;

(function () {

    // socket = new WebSocket('wss://7a6907b0.ngrok.io/rooms/1000');
    socket = new WebSocket('ws://localhost:8888/rooms/1000');
    let message = {"message": "Hi"};
    let data = JSON.stringify(message);

    socket.onopen = (evt) => {
        "use strict";
        console.info("connection opened")
    };

    socket.onmessage = (evt) => {
        "use strict";
        console.info("on message")

    };

    socket.onclose = (evt) => {
        "use strict";
        console.info("on close")

    };

    socket.onerror = (evt) => {
        "use strict";
        console.info("on error")

    };
})();
