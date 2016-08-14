require('adapterjs');

document.addEventListener('DOMContentLoaded', (() => {
  window.notify = (body, title) => {
    var options = {
      body: body,
      icon: 'https://developer.cdn.mozilla.net/static/img/favicon57.a2490b9a2d76.png'
    };
    var n = new Notification(title || body, options);
    n.onclick = (evt) => {
      window.focus();
      evt.target.close();
    }
  };

  if ("Notification" in window) {
    Notification.requestPermission().then(function(result) {
      console.debug = window.notify;
    });
  };
})());

let wsFactory = () => {
  // let ws = new WebSocket('ws://localhost:8888/ws');
  let ws = new WebSocket('wss://7a6907b0.ngrok.io/ws');
  return ws;
};

module.exports = {
  wsFactory
}