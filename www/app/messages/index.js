var faker = require('faker');

export class Message {

  constructor(args) {
    this.data = this.data || {};
    this.data['uuid'] = faker.random.uuid();
  }

  get xsrf() {
    return this.cookie('_xsrf');
  }

  set data(value) {
    this._data = value;
  }
  get data() {
    return this._data;
  }

  get json() {
    return JSON.stringify(this.data);
  }

  cookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
  }

}

export class PlainMessage extends Message {
  constructor(args) {
    super(args);
    [this.data.body, this.data.type] = [args.body, 'plain'];

  }
}

export class PhotoMessage extends Message {
  constructor(args) {
    super(args);
  }
}

export class VideoMessage extends Message {
  constructor(args) {
    super(args);
  }
}

export class AudioMessage extends Message {
  constructor(args) {
    super(args);
  }
}

export class PdfMessage extends Message {
  constructor(args) {
    super(args);
  }
}

export class FileMessage extends Message {
  constructor(args) {
    super(args);
  }
}

export class AvatarMessage extends Message {
  constructor(args) {
    super(args);
    [this.data.src, this.data.type] = [args.src, args.type || 'avatar'];
  }
}

export class RoomInfo extends Message {
  constructor(args) {
    super(args);
    [this.data.type] = [args.type];

  }
}