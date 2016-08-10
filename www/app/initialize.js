import * as messages from "messages";
import * as socket from "socket";
import * as helpers from "helpers";
import * as geveze from "./geveze";

var faker = require('faker');

document.addEventListener('DOMContentLoaded', () => {
  console.info('Initialized app');
  let avatars = [];
  for (let i = 0; i < 3; i++) avatars.push(new helpers.AvatarImage({
    size: 100
  }));

  for (let _ of avatars) document.querySelector("#avatars").appendChild(_.dom());
});

window.apps = [];
let N = 1;
window.__g = null;
for (let i = 0; i < N; i++) {
  __g = new geveze.Geveze({
    url: `ws://localhost:8888/rooms/1000?id=${i}`,
    settings: {
      recover: true
    }
  });

  apps.push(__g);
}