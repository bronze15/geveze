window.adapter = require('adapterjs');

import * as socket from "video/socket";

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


window.buffer;
window.mediaBuffers = [];
window.currentBuffer;

// window.ws = socket.factory(socket.uri());
window.ws = socket.factory('ws://localhost:8000/ws');

ws.onmessage = (evt) => {
  // console.debug(evt.data);
      var superBuffer = new Blob([evt.data], {
    type: 'video/webm'
  });
  remote.src = window.URL.createObjectURL(superBuffer);
};

window.videoBuffers = [];


function handleEvent(e) {
  // e.timeStamp has different precision in Firefox v Chrome
  var time;
  if (window.performance) {
    time = (window.performance.now() / 1000).toFixed(6);
  } else {
    time = ((Date.now() - start) / 1000).toFixed(3);
  }
  let msg = `[${e.type}] time: ${time}`;
  console.debug(msg);
}


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

window.streamFactory = () => {
  let stream = Stream.copy(window.stream);
  return stream;
};

window.bufferFactory = () => {
  // console.debug(`[bufferFactory] ${+new Date}`);

  let buffer = new Media({
    dump: true,
    bitrate: Math.pow(2, 9) * 1e3,
    stream: streamFactory(),
    player: document.querySelector("video#remote")
  });
  return buffer;
};

let initialize = () => {
  // console.debug(`[document.DOMContentLoaded] ${+new Date}`);

  for (var i = 0; i !== events.length; ++i) {
    // remote.addEventListener(events[i], handleEvent);
  }

  let pickNext = (evt) => {
    return; // FIXME FIXME FIXME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // console.debug(evt);
    try {
      remote.src = videoBuffers.shift();
    } catch (err) {
      console.warn(err);
    }
  };

  remote.onended = pickNext;
  remote.onerror = pickNext;

  window.stream = Stream.factory(Profiles.hd);
  window.media = new Media({
    dump: false,
    bitrate: Math.pow(2, 8) * 1e3, // 256K
    stream: window.stream,
    player: document.querySelector("video#local"),
    realtime: true,
  });
  media.open();
  window.currentBuffer = window.bufferFactory();
  currentBuffer.open();
  setTimeout(() => {}, 3000)

  let method2 = () => {

    window.playerUpdater = setInterval(() => {
      window.videoBuffers.push(currentBuffer.src);
      currentBuffer.close();
      currentBuffer.stream.close();
      // remote.src = videoBuffers.pop();
      ws.send(currentBuffer.blob);
      videoBuffers = [];

      window.currentBuffer = window.bufferFactory();
      window.currentBuffer.open();

    }, 1000);
  };
  
  method2();


};

document.addEventListener('DOMContentLoaded', initialize);


document.addEventListener('DOMContentLoaded', () => {

});

window.addEventListener('load', () => {
  console.debug(`[window.load] ${+new Date}`);
});

class Stream {
  constructor(constraints, fromstream) {
    this.constraints = constraints;

    if (fromstream && fromstream.constructor.name === 'MediaStream') {
      this.stream = fromstream.clone();
      this.opening = navigator.mediaDevices.getUserMedia(constraints);
    } else {
      this.opening = navigator.mediaDevices.getUserMedia(constraints);
      this.opening
        .then((stream) => this.stream = stream)
        .catch((err) => console.error(err));
    }
  }

  close() {
    for (let track of this.stream.getTracks()) track.stop();
  }

  static copy(stream) {
    let _ = new Stream(stream.constraints, stream.stream);
    return _;
  }

  static factory(constraints) {
    let _ = new Stream(constraints);
    return _;
  }
}

class BufferHolder {

  constructor(args) {}

  open() {
    this.recorder; // touch getter of recorder needed;
  }

  stop() {
    this.recorder.stop();
  }


  close() {
    this.stream.close();
  }

  get blob() {
    return new Blob(this.blobs, {
      type: 'video/webm'
    });
  }

  get src() {
    return window.URL.createObjectURL(this.blob);
  }

  get blobs() {
    if (typeof(this._blobs) === 'undefined') this._blobs = [];
    return this._blobs;
  }

  set blobs(value) {
    this._blobs = value;
  }

  UUID() {
    /*
    http://stackoverflow.com/a/105074/1766716
    */
    let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  }

  get uuid() {
    if (typeof(this._uuid) !== 'string') this._uuid = this.UUID();
    return this._uuid;
  }

  set uuid(value) {
    this._uuid = value;
  }

  get filename() {
    return `${this.UUID()}.webm`;
  }

}

class Media extends BufferHolder {

  constructor(args) {
    super();
    args = args || {};
    this.args = args;
    this.dump = args.dump || false;
    this.bitrate = args.bitrate || 1e6;
    this.stream = args.stream;
    this.player = args.player || null;
    this.realtime = args.realtime || false;
  }

  get recorder() {
    if (typeof(this._recorder) === 'undefined') {
      this.stream.opening
        .then((stream) => {

          this.stream.stream = stream;
          this._recorder = new MediaRecorder(stream, this.options);
          if (this.realtime) this.player.src = this.streamSrc;

          this._recorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              if (this.dump) this.blobs.push(event.data);
            }
          };

          this._recorder.start(100);

        }).catch((err) => {
          console.error(err)
        });
    }
    return this._recorder;
  }

  set recorder(value) {
    this._recorder = value;
  }

  get factory() {
    return {

      recorder: (options) => {
        let recorder = new MediaRecorder(this.stream, options);
        recorder.onstop = (evt) => {};

        recorder.onpause = (evt) => {};

        recorder.onresume = (evt) => {};

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            if (this.dump) this.blobs.push(event.data);
          }
        }
        return recorder;
      }
    };
  }

  get options() {

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
    options.bitsPerSecond = this.bitrate;
    return options;
  }

  get source() {
    if (typeof(this._source) === 'undefined')
      this._source = new MediaSource();

    this._source.addEventListener('sourceopen', (evt) => {
      this.buffer = this.source.addSourceBuffer('video/webm; codecs="vp8"');
    }, false);

    return this._source;
  }

  get isRecording() {
    return this._isRecording;
  }

  set isRecording(value) {
    this._isRecording = value;
  }


  set source(value) {
    this._source = value;
  }


  get streamSrc() {
    if (window.URL) {
      return window.URL.createObjectURL(this.stream.stream);
    } else {
      return this.stream.stream;
    }
  }


  get buffer() {
    return this._buffer;
  }
  set buffer(value) {
    this._buffer = value;
  }



}


module.exports = {
  Media
}