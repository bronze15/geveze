window.adapter = require('adapterjs');

import * as socket from "video/socket";

function __(argument) {
  let ws = socket.factory('ws://echo.websocket.org');

  ws.onopen = (evt) => {
    ws.send('Merhaba Dünya');
  };

  ws.onmessage = (evt) => {
    let msg = `[**] ${evt.data}`;
    console.debug(msg);;
  };
}

document.addEventListener('DOMContentLoaded', () => {
  console.debug(`[document.DOMContentLoaded] ${+new Date}`);
  window.media = new Media();
});

window.addEventListener('load', () => {
  console.debug(`[window.load] ${+new Date}`);
});


class BufferHolder {


  download(chunk, filename) {

    let a = document.createElement('a');
    let url = media.src(chunk);
    a.href = url;
    a.style.display = 'none';

    a.download = filename;
    a.innerText = filename;

    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  constructor() {
    setInterval(() => {
      return;
      console.warn(`[worker @ ${+ new Date}] | ${media.blobs.length}`);
      media.download(media.blobs, window.media.filename(0));
    }, 5000);

  }

  get chunks() {
    if (typeof(this._chunks) === 'undefined') this._chunks = [];
    return this._chunks;
  }

  set chunks(value) {
    this._chunks = value;
  }

  set current(value) {
    this._current = value;
  }

  get player() {
    return remote.play().then((evt) => {
      console.warn('playing')
    }).catch((err) => {
      console.error(err);
    })
  };

  play() {

  }
  pause() {
    if (!this.isPaused) this.recorder.pause();
  }

  resume() {
    if (this.isPaused) this.recorder.resume();
  }

  record() {
    if (this.isRecording) {
      return;
    }
    this.recorder = this.factory.recorder(this.options);
    this.recorder.start(100);
    console.log(this.blobs);
  }

  stop() {
    if (!this.isRecording) return;
    this.recorder.stop();
  }

  get isRecording() {
    return this.recorder.state === 'recording';
  }

  get isPaused() {
    return this.recorder.state === 'paused';
  }

  blob(data) {
    return new Blob(data, {
      type: 'video/webm'
    });
  }

  src(data) {
    return window.URL.createObjectURL(this.blob(data));
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

  filename(index) {
    return `${this.UUID()}-${index}.webm`;
  }

}

class Media extends BufferHolder {

  constructor() {
    super();

    this.init();

    this.source = this.factory.source();

    this.source.addEventListener('sourceopen', (evt) => {
      this.buffer = this.source.addSourceBuffer('video/webm; codecs="vp8"');
    }, false);
  }

  init() {
    this.debug = true;
    this.blobs = [];

    navigator
      .mediaDevices
      .getUserMedia(this.constraints).
    then((stream) => {
      this.stream = stream;

      if (this.debug) this.record();

      if (window.URL) {
        local.src = window.URL.createObjectURL(stream);
      } else {
        local.src = stream;
      }
    })
      .catch((error) => {
        console.error(error);
      });
  }

  get factory() {
    return {
      source: () => {
        let source = new MediaSource();
        return source;
      },
      recorder: (options) => {
        let recorder = new MediaRecorder(this.stream, options);
        recorder.onstop = (evt) => {};

        recorder.onpause = (evt) => {};

        recorder.onresume = (evt) => {};

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            this.blobs.push(event.data);
          }
        }
        return recorder;
      },
      constraints: {
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

      }
    };
  }


  get constraints() {
    return this.factory.constraints.hd;
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
    options.bitsPerSecond = 1000000;
    return options;
  }

  get source() {
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

  get stream() {
    return this._stream;
  }

  set stream(value) {
    this._stream = value;
  }

  get buffer() {
    return this._buffer;
  }
  set buffer(value) {
    this._buffer = value;
  }

  get recorder() {
    return this._recorder;
  }

  set recorder(value) {
    this._recorder = value;
  }



}