import * as socket from "socket";
import * as helpers from "helpers";
import * as messages from "messages";
import * as exceptions from "exceptions";

let faker = require('faker');

export class Geveze {

  constructor(args) {
    this._settings = args.settings || {
      recover: false
    };

    this.avatar = new helpers.AvatarImage();

    this.url = args.url;
    this.connect();

  }

  connect() {

    this.ws = new WebSocket(this.url);

    this.ws.onopen = (evt) => {
      console.info(`connection opened: ${evt.target.url}}`);
      let ws = evt.target;

      this.sendAvatar();
      this.tests();


    };

    this.ws.onclose = (evt) => {
      console.warn(`closed: ${evt.target.url}}. code: ${evt.code} reason: ${evt.reason}.`);
      // console.info('reconnecting....');
      if (this.settings.recover) this.connect(); // FIXME !!! setTimeout
    };

    this.ws.onmessage = (evt) => {
      let data = JSON.parse(evt.data);
      // if (data.type === 'subscribed' || data.type === 'unsubscribed') return;
      // data.date = new Date(data.date);
      console.log({
        type: data.type,
        // sender: data.sender,
        // time: data.date,
        body: data.body,
        users: data.users,
      });
    };

    this.ws.onerror = (evt) => {
      let data = evt.data;
      // console.error(data);
    };
  }


  get settings() {
    return this._settings;
  }

  set settings(value) {
    this._settings = value;
  }

  send(data) {
    this.ws.send(JSON.stringify(data));
  }

  close() {
    this.ws.close();
  }

  tests() {
    let messages = [
      '✋', '😁',
      'hi...',
      'www.google.com',
      'mailto:serefguneysu@gmail.com',
      "intent://scan/#Intent;scheme=zxing;package=com.google.zxing.client.android;S.browser_fallback_url=http%3A%2F%2Fzxing.org;end",
      "intent://scan/#Intent;scheme=zxing;package=com.google.zxing.client.android;end"
    ];

    for (let _ of messages) this.sendMessage(_);
    // console.log(avatar.data);
  }


  sendAvatar() {
    let avatar = new messages.AvatarMessage({
      src: this.avatar.src
    });

    this.send(avatar.data);
  }

  changeAvatar() {
    this.avatar.renew();

    let avatar = new messages.AvatarMessage({
      src: this.avatar.src,
      type: 'avatar_change'
    });

    this.send(avatar.data);
  }


  sendMessage(message) {
    console.warn(message);

    let _ = new messages.PlainMessage({
      body: message
    });

    this.send(_.data);

    // throw new exceptions.NotImplementedException();
  }

  getOnlineUsers() {

    let _ = new messages.RoomInfo({
      type: 'online_users'
    });

    this.send(_.data);
  }

}