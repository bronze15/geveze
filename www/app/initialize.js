import * as messages from "messages";
import * as socket from "socket";
import * as helpers from "helpers";
import * as geveze from "./geveze";
import $ from "jquery";

window.$ = require('jquery')
window.jQuery = $;

var faker = require('faker');

document.addEventListener('DOMContentLoaded', () => {
  console.info('Initialized app');
  // avatarFun();
});


function avatarFun() {
  let avatars = [];
  let N = 24;
  for (let i = 0; i < N; i++) avatars.push(new helpers.AvatarImage({
    size: 100, 
  }));

  for (let _ of avatars) document.querySelector("#avatars").appendChild(_.dom());
}

window.apps = [];

let N = 1;
let M = 2;

window.__1000 = null;
window.__1001 = null;

let settings = {
  recover: false,
  test: false,
  log: true,
  avatar_send: true,
};

for (let i = 0; i < N; i++) {
  __1000 = new geveze.Geveze({
    url: `ws://localhost:8888/rooms/1000?id=${i}`,
    settings: settings
  });

  apps.push(__1000);
}


// for (let i = 0; i < M; i++) {
//   __1001 = new geveze.Geveze({
//     url: `ws://localhost:8888/rooms/1001?id=${i}`,
//     settings: settings
//   });

//   apps.push(__1001);
// }


$(document).ready(function() {
  if (!window.console) window.console = {};
  if (!window.console.log) window.console.log = function() {};

  $("#messageform").on("submit", function() {
    send($(this));
    return false;
  });
  $("#messageform").on("keypress", function(e) {
    if (e.keyCode == 13) {
      send($(this));
      return false;
    }
  });
  $("#message").select(); // for mobile debugging UX, disable focus
});

function send(form) {
  var message = form.formToDict();
  if (message.body === "") return;
  window.__1000.sendMessage(message.body);
  form.find("input[type=text]").val("").select();
}

jQuery.fn.formToDict = function() {
  var fields = this.serializeArray();
  var json = {};
  for (var i = 0; i < fields.length; i++) {
    json[fields[i].name] = fields[i].value;
  }
  if (json.next) delete json.next;
  return json;
};