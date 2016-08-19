window.adapter = require('adapterjs');

import * as socket from "video/socket";


var events = [
  'abort',
  'autocomplete',
  'autocompleteerror',
  'beforecopy ',
  'beforecut',
  'beforepaste',
  'blur',
  'cancel',
  'canplay',
  'canplaythrough',
  'change',
  'click',
  'close',
  'contextmenu',
  'copy',
  'cuechange',
  'cut',
  'dblclick',
  'drag',
  'dragend',
  'dragenter',
  'dragleave',
  'dragover',
  'dragstart',
  'drop',
  'durationchange',
  'emptied',
  'ended',
  'error',
  'focus',
  'input',
  'invalid',
  'keydown',
  'keypress',
  'keyup',
  'load',
  'loadeddata',
  'loadedmetadata',
  'loadstart',
  'needkey',
  'paste',
  'pause',
  'play',
  'playing',
  'progress',
  'ratechange',
  'reset',
  'resize',
  'scroll',
  'search',
  'seeked',
  'seeking',
  'select',
  'selectstart',
  'show',
  'stalled',
  'submit',
  'suspend',
  'timeupdate',
  'toggle',
  'volumechange',
  'waiting',
  'webkitfullscreenchange',
  'webkitfullscreenerror',
  'webkitkeyadded',
  'webkitkeyerror',
  'webkitkeymessage',
  'webkitneedkey'
];

function handleEvent(e) {
  // e.timeStamp has different precision in Firefox v Chrome
  var time;
  if (window.performance) {
    time = (window.performance.now() / 1000).toFixed(6);
  } else {
    time = ((Date.now() - start) / 1000).toFixed(3);
  }
  console.debug(`[player] time: ${time} type: ${e.type}`);
}

window.Profiles = {
  qvga: {
    video: {
      mandatory: {
        maxWidth: 320,
        maxHeight: 180
      }
    }
  },
  vga: {
    video: {
      mandatory: {
        maxWidth: 640,
        maxHeight: 360
      }
    }
  },
  hd: {
    video: {
      mandatory: {
        minWidth: 1280,
        minHeight: 720
      }
    }
  },
  fullhd: {
    video: {
      mandatory: {
        minWidth: 1920,
        minHeight: 1080
      }
    }
  },
  default: {
    video: {
      audio: false,
      video: true
    },
    audio: {
      audio: true,
      video: false
    }
  }

};

window.App = {
  queue: [],
  update: () => {
    let video = App.video();
    remote.src = video;
    App.ws.send(App.blob());
  },
  init: {
    first: () => {
      App.opening = navigator.mediaDevices.getUserMedia(Profiles.hd);
      App.opening
        .then((stream) => {
          App.mainstream = stream;
          if (window.URL) {
            local.src = window.URL.createObjectURL(App.mainstream);
          } else {
            local.src = App.mainstream;
          }
        })
        .catch((err) => console.error(err));
    },
    media: () => {


      if (typeof(App.recorder) !== 'undefined') App.destroy();

      App.opening = navigator.mediaDevices.getUserMedia(Profiles.qvga);
      App.opening
        .then((stream) => {
          App.blobs = [];

          App.stream = stream;
          App.recorder = new MediaRecorder(stream, App.options());
          App.recorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              App.blobs.push(event.data);
            }
          };
          App.recorder.start(100);
        })
        .catch((err) => console.error(err));

    },
    socket: (url) => {
      App.ws = new WebSocket(url);
      App.ws.binaryType = "arraybuffer";

      App.ws.onmessage = (evt) => {
        var superBuffer = new Blob([evt.data], {
          type: 'video/webm'
        });

        console.debug(`[chunk size: ${superBuffer.size/1024.0} KB] ${new Date().toISOString()}`);

        remotedebug.src = window.URL.createObjectURL(superBuffer);
      };
    },
  },
  blob: () => {
    return new Blob(App.blobs, {
      type: 'video/webm'
    });
  },
  video: () => {
    return window.URL.createObjectURL(App.blob());
  },
  src: {
    stream: () => {
      if (window.URL) {
        return window.URL.createObjectURL(App.stream);
      } else {
        return App.stream;
      }
    }
  },
  destroy: () => {
    App.recorder.stop();

    return;
    for (let track of App.stream.getTracks()) {
      track.stop();
      App.stream.removeTrack(track);
    }
    App.opening = null;
    App.stream = null;
    App.recorder = null;

  },
  options: () => {
    var options = {
      mimeType: 'video/webm;codecs=vp9'
    };

    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.log(options.mimeType + ' is not Supported');
      options = {
        mimeType: 'video/webm;codecs=vp8'
      };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log(options.mimeType + ' is not Supported');
        options = {
          mimeType: 'video/webm'
        };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.log(options.mimeType + ' is not Supported');
          options = {
            mimeType: ''
          };
        }
      }
    }
    options.bitsPerSecond = Math.pow(2, 10) * 1e3;
    return options;
  }
};

document.addEventListener('DOMContentLoaded', (evt) => {

  for (var i = 0; i !== events.length; ++i) {
    continue;
    remote.addEventListener(events[i], handleEvent);
  }
  App.init.first();
  App.init.socket('ws://localhost:8000/ws');

  setInterval(() => {
    App.init.media();
    setTimeout(App.update, 1000);
  }, 1000);

});