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
  function uri() {
    let hostname, host, protocol, isSecure;

    [hostname, host, protocol, isSecure] = [
      location.hostname,
      location.host,
      location.protocol,
      location.protocol === 'https:',
    ];

    let uri = `ws${isSecure ? 's' : ''}://${host}/ws`;
    return uri;
  }

  console.debug();
  let wsUri = uri();
  let ws = new WebSocket(wsUri);
  return ws;
};

module.exports = {
  wsFactory
}