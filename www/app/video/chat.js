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



class Media {

  constructor() {
    navigator
      .mediaDevices
      .getUserMedia(this.constraints).
    then((stream) => {
      this.stream = stream;
      this.stream.onactive = (a, b) => {
        console.warn();
      };
      if (window.URL) {
        local.src = window.URL.createObjectURL(stream);
        remote.src = window.URL.createObjectURL(stream);
      } else {
        local.src = stream;
        remote.src = stream;
      }
    })
      .catch((error) => {
        console.error(error);
      });

    this.source = this.factory.source();

    this.source.addEventListener('sourceopen', (evt) => {
      this.buffer = this.source.addSourceBuffer('video/webm; codecs="vp8"');
    }, false);


  }

  get factory() {
    return {
      source: () => {
        let source = new MediaSource();
        return source;
      },
      recorder: (stream, options) => {
        let recorder = new MediaRecorder(stream, options);
        recorder.onstop = (evt) => {
          console.log(`Stopped: ${event}`);
        };
        recorder.ondataavailable = (event) => {
          console.info(`[data] ${+new Date}. ${this.blobs.length}`);
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
  }

  record() {

    if (this.isRecording) {
      return;
    }

    this._recorder = this.factory.recorder(this.stream, this.options);
    this._recorder.start(10.0);
    this.isRecording = true;

    // throw new Error("Not Implemented");
  }

  stop() {
    if (!this.isRecording) return;
    this._recorder.stop(1000.0);
    this.isRecording = false;
  }

  get constraints() {

    const constraints = {
      audio: false,
      video: true
    };

    return constraints;
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


  get blob() {
    return new Blob(this.blobs, {
      type: 'video/webm'
    });
  }

  get src() {

    new Blob(this.blobs, {
      type: 'video/webm'
    });
    return window.URL.createObjectURL(this.blob);
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

  get blobs() {
    if (typeof(this._blobs) === 'undefined') this._blobs = [];

    return this._blobs;
  }

  set blobs(value) {
    this._blobs = value;
  }

  get recorder() {
    return this._recorder;
  }

  set recorder(value) {
    this._recorder = value;
  }


}