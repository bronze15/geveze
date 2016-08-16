window.adapter = require('adapterjs');

import * as socket from "video/socket";

document.addEventListener('DOMContentLoaded', () => {
  console.debug(`[document.DOMContentLoaded] ${+new Date}`);
  window.media = new Media({
    dump: false
  });
  window.recorder = new Media({
    dump: true
  });

  window.stream = new Stream({
    constraints: {
      audio: false,
      video: true
    }
  });
});

window.addEventListener('load', () => {
  console.debug(`[window.load] ${+new Date}`);
});


class Stream {
  constructor(args) {
    navigator
      .mediaDevices
      .getUserMedia(args.constraints).
    then((stream) => {
      this.stream = stream;
      console.log(`1. then: ${new Date().toString()}`);
    })
      .catch((error) => {
        console.error(error);
      });

    console.log(`2. ctor: ${new Date().toString()}`);
  }


  close() {
    for (let track of this.stream.getTracks()) track.stop();
  }

}

class BufferHolder {

  constructor(args) {}

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
    this.dump = args.dump || false;
    this.bitrate = args.bitrate || 1e6;

    this.source = this.factory.source();

    this.source.addEventListener('sourceopen', (evt) => {
      this.buffer = this.source.addSourceBuffer('video/webm; codecs="vp8"');

    }, false);
  }

  open() {

    navigator
      .mediaDevices
      .getUserMedia(this.constraints).
    then((stream) => {
      this.stream = stream;

      if (this.dump) this.record();
    })
      .catch((error) => {
        console.error(error);
      });
  }

  close() {
    for (let track of this.stream.getTracks()) track.stop();
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
            if (this.dump) this.blobs.push(event.data);
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
    options.bitsPerSecond = this.bitrate;
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

  get streamSrc() {
    if (window.URL) {
      return window.URL.createObjectURL(this.stream);
    } else {
      return this.stream;
    }
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


module.exports = {
  Media
}