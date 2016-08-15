let factory = (url) => {
  if (typeof(url) === 'string'){
    let ws = new WebSocket(url);
    ws.binaryType = "arraybuffer";
    return ws;
  } 

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
  ws.binaryType = "arraybuffer";
  return ws;
};

module.exports = {
  factory
}