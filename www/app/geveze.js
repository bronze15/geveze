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


  send(data) {
    this.update_ui(data);

    setTimeout(() => {
      this.ws.send(JSON.stringify(data));
    }, 0.0);
  }

  update_ui(data) {
    if (data.type === 'avatar') {
      if (data.sender) {
        application.avatar[data.sender] = data;
      }
    } else if (data.sender) {
      data.avatar = application.avatar[data.sender];
      data.is_me = data.sender === this.uuid;
      application[data.type].push(data);
    } else if (data.type === 'notify_uuid') {
      this._uuid = data.me;

    } else {
      application[data.type].push(data);
    }
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = (evt) => {
      if (this.settings.log) console.info(`connection opened: ${evt.target.url}}`);
      let ws = evt.target;

      if (this.settings.send_avatar) this.sendAvatar();

      if (this.settings.test) this.tests();

    };

    this.ws.onclose = (evt) => {
      if (this.settings.log) console.warn(`closed: ${evt.target.url}}. code: ${evt.code} reason: ${evt.reason}.`);
      if (this.settings.recover) this.connect(); // FIXME !!! setTimeout
    };

    this.ws.onmessage = (evt) => {
      let data = JSON.parse(evt.data);
      // if (data.type === 'subscribed' || data.type === 'unsubscribed') return;
      // data.date = new Date(data.date);

      if (this.settings.log) console.log({
        type: data.type,
        uuid: data.uuid,
        room: data.room,
        src: data.src,
        sender: data.sender,
        time: data.date,
        body: data.body,
        users: data.users,
      });

      // console.log(data);
      this.update_ui(data);
    };

    this.ws.onerror = (evt) => {
      let data = evt.data;
      // console.error(data);
    };
  }


  get settings() {
    return this._settings;
  }


  get uuid() {
    return this._uuid;
  }

  set uuid(value) {
    this._uuid = value;
  }

  set settings(value) {
    this._settings = value;
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

    let images = [
      'http://placehold.it/200x200/bbaaaa/ffffff?text=image-1',
      'http://placehold.it/200x200/aabbaa/ffffff?text=image-2',
      'http://placehold.it/200x200/aaaabb/ffffff?text=image-3',
    ];

    let videos = [
      'http://www.sample-videos.com/video/mkv/240/big_buck_bunny_240p_1mb.mkv',
      'http://www.sample-videos.com/video/mp4/240/big_buck_bunny_240p_1mb.mp4'
    ];

    let audios = [
      'http://www.w3schools.com/html/horse.ogg'
    ];

    let pdfs = [
      'http://www.publishers.org.uk/_resources/assets/attachment/full/0/2091.pdf'
    ];
    let files = [
      'http://humanstxt.org/humans.txt'
    ];

    for (let _ of messages) this.sendMessage(_);
    for (let _ of images) this.sendImage(_);
    for (let _ of videos) this.sendVideo(_);

    for (let _ of audios) this.sendAudio(_);
    for (let _ of pdfs) this.sendPdf(_);
    for (let _ of files) this.sendFile(_);
  }


  sendAvatar() {
    let avatar = new messages.AvatarMessage({
      src: this.avatar.src,
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

    let _ = new messages.PlainMessage({
      body: message
    });

    this.send(_.data);

  }

  sendImage(src, description) {

    let _ = new messages.ImageMessage({
      src: src
    });
    this.send(_.data);

  }
  sendVideo(src, description) {
    let _ = new messages.VideoMessage({
      src: src
    });
    this.send(_.data);
  }
  sendAudio(src, description) {
    let _ = new messages.AudioMessage({
      src: src
    });
    this.send(_.data);
  }
  sendPdf(src, description) {
    let _ = new messages.PdfMessage({
      src: src
    });
    this.send(_.data);
  }
  sendFile(src, description) {
    let _ = new messages.FileMessage({
      src: src
    });
    this.send(_.data);
  }

  getOnlineUsers() {

    let _ = new messages.RoomInfo({
      type: 'online_users'
    });

    this.send(_.data);
  }

}