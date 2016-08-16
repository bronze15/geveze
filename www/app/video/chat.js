window.adapter = require('adapterjs');

import * as socket from "video/socket";

document.addEventListener('DOMContentLoaded', () => {
  console.debug(`[document.DOMContentLoaded] ${+new Date}`);

  // window.recorder = new Media({
  //   dump: true
  // });

  window.stream = new Stream(false, {
    audio: false,
    video: true
  });

  window.media = new Media({
    dump: true,
    stream: window.stream
  });

  media.record();
});

window.addEventListener('load', () => {
  console.debug(`[window.load] ${+new Date}`);
});

class Recorder {
  constructor(args) {}
}



class BufferHolder {

  constructor(args) {}

  record() {
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


class Stream {
  constructor(dump = false, constraints) {
    this.opening = navigator.mediaDevices.getUserMedia(constraints);
    this.opening
      .then((stream) => this.stream = stream)
      .catch((err) => console.error(err));
  }

  close() {
    for (let track of this.stream.getTracks()) track.stop();
  }
}

class Media extends BufferHolder {

  constructor(args) {
    super();
    args = args || {};
    this.dump = args.dump || false;
    this.bitrate = args.bitrate || 1e6;
    this.stream = args.stream;
  }

  get recorder() {
    if (typeof(this._recorder) === 'undefined') {
      this.stream.opening
        .then((stream) => {
          this.stream.stream = stream;
          this._recorder = new MediaRecorder(stream, this.options);

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


  get constraints() {
    return this.factory.constraints.hd;
  }

  get profiles() {
    return {
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