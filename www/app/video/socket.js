  let uri = () => {

    let hostname, host, protocol, isSecure;

    [hostname, host, protocol, isSecure] = [
      location.hostname,
      location.host,
      location.protocol,
      location.protocol === 'https:',
    ];

    let _ = `ws${isSecure ? 's' : ''}://${host}/ws`;
    return _;
  }

  let factory = (url) => {
    let ws = new WebSocket(url);
    ws.binaryType = "arraybuffer";
    return ws;
  };

  module.exports = {
    factory, uri
  }