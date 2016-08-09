document.addEventListener('DOMContentLoaded', () => {
  // do your setup here
  console.log('Initialized app');
});


var socket = null;


//noinspection JSUnusedGlobalSymbols
let UI = {
  show: (message) => {
    "use strict";
    let container = document.querySelector("#inbox");

    let el = document.createElement("div");
    let _time = document.createElement("time");
    let _body = document.createElement("span");
    let _avatar = document.createElement("img");

    el.setAttribute("data-sender", message.sender);
    el.setAttribute("data-message", message.uuid);
    _time.setAttribute("datetime", message.date);

    el.appendChild(_time)

    switch (message.action) {
      case "message":
        switch (message.type) {
          case "plain":
            el.innerHTML = message.body;
            break;
          case "image":
            for (let image of message.images) {
              let a = document.createElement('a');
              a.setAttribute("href", image);
              a.setAttribute("target", "_blank");
              a.setAttribute("rel", "nofollow");

              let img = document.createElement("img");
              img.setAttribute("src", image);
              img.setAttribute("alt", message.description);
              img.setAttribute("height", 72);

              a.appendChild(img);
              el.appendChild(a);

            }
            break;
          case "audio":
            break;
          case "video":
            for (let video of message.videos) {
              let video_element = document.createElement("video");
              let source = document.createElement("source");
              video_element.setAttribute("preload", '');
              video_element.setAttribute("controls", '');
              video_element.setAttribute("height", 120);
              source.setAttribute("src", video);
              video_element.appendChild(source);
              el.appendChild(video_element);
              console.log(video_element);
            }
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
    container.appendChild(el);
    // console.info(el)
  }

};
(function() {

  // socket = new WebSocket('wss://7a6907b0.ngrok.io/rooms/1000');
  socket = new WebSocket('ws://localhost:8888/rooms/1000');

  //noinspection JSLastCommaInObjectLiteral
  var example_data = {
    plain_message: {
      action: "message",
      type: "plain",
      body: "Selam"
    },
    photo_message: {
      action: "message",
      type: "image",
      description: "photo description",
      images: [
        'http://placehold.it/200x200/bbaaaa/ffffff?text=image-1',
        'http://placehold.it/200x200/aabbaa/ffffff?text=image-2',
        'http://placehold.it/200x200/aaaabb/ffffff?text=image-3',
      ]
    },
    audio_message: {
      action: "message",
      type: "audio",
      audios: []
    },
    video_message: {
      action: "message",
      type: "video",
      videos: [
        'http://www.sample-videos.com/video/mkv/240/big_buck_bunny_240p_1mb.mkv',
        'http://www.sample-videos.com/video/mp4/240/big_buck_bunny_240p_1mb.mp4'
      ]
    },
    avatar_upload: {
      action: "avatar",
      type: "upload",
      data: "my-cool-avatar.jpg"
    },
    avatar_change: {
      action: "avatar",
      type: "change",
      data: "my-new-cool-avatar.jpg"
    },
    pulse: {
      action: "pulse",
      type: "notification",
      people: []
    },
  };

  socket.onopen = (evt) => {
    "use strict";
    let ws = evt.target;
    for (let _ in example_data) {
      ws.send(JSON.stringify(example_data[_]));
    }

    console.info("connection opened")
  };

  socket.onmessage = (evt) => {
    "use strict";
    console.info("on message");
    let msg = JSON.parse(evt.data);
    //noinspection JSUnresolvedFunction
    console.table([msg]);
    UI.show(msg);
  };

  //noinspection JSUnusedLocalSymbols
  socket.onclose = (evt) => {
    "use strict";
    console.info("on close")

  };

  //noinspection JSUnusedLocalSymbols
  socket.onerror = (evt) => {
    "use strict";
    console.info("on error")

  };
})();