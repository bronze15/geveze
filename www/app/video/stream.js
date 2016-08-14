/* 
Define Websocket 
*/

window.addEventListener('load', () => {});

let video = require('video');

window.ws = video.wsFactory();
window.ws.binaryType = "arraybuffer";

ws.onopen = (evt) => {};

ws.onclose = (evt) => {
  ws = video.wsFactory();
};

ws.onmessage = (evt) => {
    var superBuffer = new Blob([evt.data], {
    type: 'video/webm'
  });
  remoteVideo.src = window.URL.createObjectURL(superBuffer);
  remoteVideo.controls = true;
}


window.addEventListener('load', () => {
  var mediaSource = new MediaSource();
  mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
});



function handleSourceOpen(event) {
  console.log('MediaSource opened');
  sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
  console.log('Source buffer: ', sourceBuffer);
}


function handleSuccess(stream) {
  console.log('getUserMedia() got stream: ', stream);
  window.stream = stream;
  if (window.URL) {
    gumVideo.src = window.URL.createObjectURL(stream);
  } else {
    gumVideo.src = stream;
  }
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}


// The nested try blocks will be simplified when Chrome 47 moves to Stable
window.startRecording = function startRecording() {
  window.recordedBlobs = [];
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
  try {
    window.mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder: ' + e);
    console.error('Exception while creating MediaRecorder: ' + e + '. mimeType: ' + options.mimeType);
    return;
  }
  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  mediaRecorder.onstop = handleStop;
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start(50); // collect 10ms of data
  console.log('MediaRecorder started', mediaRecorder);
}

window.stopRecording = function() {
  window.mediaRecorder.stop();
  console.log('Recorded Blobs: ', recordedBlobs);
  recordedVideo.controls = true;
}

window.handleDataAvailable = function(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

window.play = function() {
  var superBuffer = new Blob(recordedBlobs, {
    type: 'video/webm'
  });
  recordedVideo.src = window.URL.createObjectURL(superBuffer);
}

window.handleStop = function(event) {
  console.log('Recorder stopped: ', event);
}

var gumVideo = document.querySelector('video#gum');
var recordedVideo = document.querySelector('video#recorded');
var remoteVideo = document.querySelector('video#remote');
var button = document.querySelector('button#send');


recordedVideo.addEventListener('error', function(ev) {
  console.error('MediaRecording.recordedMedia.error()');
  alert('Your browser can not play\n\n' + recordedVideo.src + '\n\n media clip. event: ' + JSON.stringify(ev));
}, true);


window.mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
window.mediaRecorder;
window.recordedBlobs;
window.sourceBuffer;
window.stream;

// Use old-style gUM to avoid requirement to enable the
// Enable experimental Web Platform features flag in Chrome 49

var constraints = {
  audio: false,
  video: true
};

navigator.mediaDevices.getUserMedia(constraints).
then(handleSuccess).catch(handleError);

button.onclick = (evt) => {
  startRecording();
  setTimeout(() => {
    stopRecording();
    play();

    var superBuffer = new Blob(recordedBlobs, {
      type: 'video/webm'
    });

    ws.send(superBuffer);
  }, 1000.0);

}