import * as messages from "messages";
import * as helpers from "helpers";
import * as geveze from "./geveze";
import $ from "jquery";

window.$ = require('jquery')
window.jQuery = $;
window.Vue = require('vue');
window.faker = require('faker');

document.addEventListener('DOMContentLoaded', () => {
  console.info('Initialized app');

  let settings = {
    recover: true,
    test: false,
    log: "verbose",
    send_avatar: true,
    slow_down: 0.0,
  };

  let app = new Vue({
    el: '#app',
    data: {
      messages: [],
      avatar: {},
      online_users: {},
    },
  });

  window.geveze = new geveze.Geveze({
    url: `ws://localhost:8888/rooms/1000/ws?id=${faker.internet.userName()}`,
    settings: settings,
    app: app
  });

});

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
  window.geveze.message(message.body);
  form.find("input[type=text]").val("").select();
}

// jQuery sen de gidicisin.
jQuery.fn.formToDict = function() {
  var fields = this.serializeArray();
  var json = {};
  for (var i = 0; i < fields.length; i++) {
    json[fields[i].name] = fields[i].value;
  }
  if (json.next) delete json.next;
  return json;
};