import * as messages from "messages";
import * as socket from "socket";
import * as helpers from "helpers";

var faker = require('faker');


document.addEventListener('DOMContentLoaded', () => {


  console.log('Initialized app');
  let avatars = [];
  for (let i = 0; i < 10; i++) avatars.push(new helpers.Avatar({
    size: 256,
    min: 3,
    max: 6
  }));
  for (let avatar of avatars) document.querySelector("#avatars").appendChild(avatar.dom());
});



let connections = [];
let rooms = {
  1000: 'ws://localhost:8888/rooms/1000',
  1001: 'ws://localhost:8888/rooms/1001',
};

for (let i = 0; i < 1; i++) {
  continue;

  let conn = new socket.Connection({
    url: rooms[1000],
    onopen: socket.events.onopen,
    onclose: socket.events.onclose,
    onerror: socket.events.onerror,
    onmessage: socket.events.onmessage
  });

  connections.push(conn);
}