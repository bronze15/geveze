import * as helpers from "helpers";
import * as messages from "messages";
import * as exceptions from "exceptions";
import * as example from "example";
let faker = require('faker');

/*
Hmm, sesli düşünüyorum.
şeklinde bir çözüm olur mu?

let events = {
  save: new Event('save'),
  publish: new Event('publish'),
  new: new Event('new'),
  preview: new Event('preview')
}

let callbacks = {
  save: (_) => {},
  publish: (_) => {},
  new: (_) => {},
  preview: (_) => {},
}

events.forEach(function(e, i, array) {
  document.addEventListener(e, callbacks[e]);
});
*/

var ClientEvents = {
  send_avatar: 'send_avatar',
  get_onlineusers: 'get_onlineusers',
  get_avatars: 'get_avatars',
  send_text: 'send_text',
  send_image: 'send_image',
  send_video: 'send_video',
  send_audio: 'send_audio',
  send_pdf: 'send_pdf',
  send_file: 'send_file'
}

var ServerEvents = {
  subscribed: 'subscribed',
  unsubscribed: 'unsubscribed',
  send_uuid: 'send_uuid',
  send_avatars: 'send_avatars',
  send_avatar: 'send_avatar',
  send_text: 'send_text',
  send_image: 'send_image',
  send_video: 'send_video',
  send_audio: 'send_audio',
  send_pdf: 'send_pdf',
  send_file: 'send_file',
  send_onlineusers: 'send_onlineusers',
}

export class Geveze {
  constructor(args) {
    this._settings = args.settings || {
      recover: false
    };

    this.avatar = new helpers.AvatarImage();
    this.url = args.url;
    this._app = args.app;
    this._retry_interval = 0.5;

    this.connect();
  }


  get app() {
    return this._app;
  }

  set app(value) {
    this._app = value;
  }

  get retry_interval() {
    return this._retry_interval;
  }

  set retry_interval(value) {
    this._retry_interval = value;
  }

  sendAvatar() {
    this.send({
      type: ClientEvents.send_avatar,
      src: this.avatar.src
    });
    console.debug('sendAvatar();');
  }

  getOnlineUsers() {
    this.send({
      type: ClientEvents.get_onlineusers
    });
    console.debug('getOnlineUsers();');
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = (evt) => {
      if (this.settings.log) console.debug(`connection opened: ${evt.target.url}}`);
      let ws = evt.target;
    };

    this.ws.addEventListener('open', (e) => {
      if (this.settings.send_avatar) this.sendAvatar();
    });

    this.ws.addEventListener('open', (e) => {
      this.send({
        type: ClientEvents.get_avatars
      });
    });


    this.ws.onclose = (evt) => {
      if (this.settings.log) console.warn(`closed: ${evt.target.url}}. code: ${evt.code} reason: ${evt.reason}.`);

      if (this.settings.recover) {
        this.retry_interval *= 2.0;
        setTimeout(() => {
          console.warn(`connection can not be established. trying in ${this.retry_interval} seconds.`)
          this.connect();
        }, this.retry_interval * 1000.0);
      }
    };

    this.ws.onmessage = (evt) => {
      let data = JSON.parse(evt.data);
      this.broker(data);
    };

    this.ws.addEventListener('message', (evt) => {
      let data = JSON.parse(evt.data);

      switch (this.settings.log) {
        case "short":
          console.debug({
            type: data.type,
            uuid: data.uuid,
            room: data.room,
            src: data.src,
            sender: data.sender,
            time: data.date,
            body: data.body,
            users: data.users,
          });
          break;
        case "verbose":
          console.debug(data);
          break;
        default:
          break;
      }
    });

    this.ws.onerror = (evt) => {
      let data = evt.data;
      console.error(data);
    }
  }


  send(data) {
    /*
      Burası (switch) uzayıp gidecek.
      Minik fonksiyonlara ayırmak lazım.
    */
    switch (data.type) {

      case ClientEvents.send_text:
        [data.avatar, data.is_me] = [{
            src: this.avatar.src
          },
          true
        ];
        this.app.messages.push(data);

        setTimeout(() => {
          this.ws.send(JSON.stringify(data));
        }, this.settings.slow_down);

        break;
      default:
        this.ws.send(JSON.stringify(data));
        break;

    }
  }

  message(text) {
    this.send({
      body: text,
      type: ClientEvents.send_text,
      uuid: faker.random.uuid()
    });
  }

  broker(data) {
    /*
      Burası (switch) uzayıp gidecek.
      Minik fonksiyonlara ayırmak lazım.
    */

    console.debug(`data type: ${data.type}`);
    console.debug(data);

    switch (data.type) {

      case ServerEvents.send_uuid:
        this.uuid = data.uuid;
        break;

      case ServerEvents.send_avatar:
        this.app.avatar[data.sender] = data.src;
        this.getOnlineUsers();

        break;

      case ServerEvents.send_avatars:
        for (let _ in data.avatars) this.app.avatar[_] = data.avatars[_];
        break;


      case ClientEvents.send_text:
        [data.avatar, data.is_me] = [{
            src: this.app.avatar[data.sender]
          },
          this.is_me(data)
        ];
        this.app.messages.push(data);

        break;

      case ServerEvents.send_onlineusers:
        // this.app.online_users = data.online_users;
        this.app.online_users = {};
        for (let _ of data.online_users) {
          this.app.online_users[_] = {
            avatar: this.app.avatar[_]
          }
        }
        break;

      default:
        break;
    }

  }


  is_me(data) {
    return data.sender === this.uuid;
  }


  /*
    Getir götür işleri.
  */
  
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

}