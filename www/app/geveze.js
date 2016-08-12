import * as socket from "socket";
import * as helpers from "helpers";
import * as messages from "messages";
import * as exceptions from "exceptions";
import * as example from "example";
let faker = require('faker');

export class Geveze {
  constructor(args) {
    this._settings = args.settings || {
      recover: false
    };
    this.avatar = new helpers.AvatarImage();

    this.url = args.url;
    this._retry_interval = 0.5;
    this.connect();
  }

  get retry_interval() {
    return this._retry_interval;
  }

  set retry_interval(value) {
    this._retry_interval = value;
  }

  sendAvatar() {
    console.debug('sendAvatar();');
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
      this.update_ui(data);
    };

    this.ws.addEventListener('message', (evt) => {
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
    this.update_ui(data);

    setTimeout(() => {
      this.ws.send(JSON.stringify(data));
    }, this.settings.slow_down);
  }

  update_ui(data) {
    console.debug(data);
  }


  is_me(data) {
    return data.sender === this.uuid;
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

}


var ClientEvents = {
  send_avatar: 'send_avatar',
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
  send_text: 'send_text',
  send_image: 'send_image',
  send_video: 'send_video',
  send_audio: 'send_audio',
  send_pdf: 'send_pdf',
  send_file: 'send_file',
  send_onlineusers: 'send_onlineusers',
}