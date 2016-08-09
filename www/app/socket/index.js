import * as events from "socket/events";

class Connection {
  constructor(args) {
    this.ws = new WebSocket(args.url);
    [
      this.ws.onopen,
      this.ws.onclose,
      this.ws.onerror,
      this.ws.onmessage
    ] = [
      args.onopen,
      args.onclose,
      args.onerror,
      args.onmessage,
    ]
  }
}

module.exports = {
  events: events,
  Connection: Connection
}