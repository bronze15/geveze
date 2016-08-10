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

export class ImageMessage extends Message {
  constructor(args) {
    super(args);
    [this.data.src,
      this.data.type,
      this.data.description
    ] = [args.src, 'image', args.description];
  }
}

export class VideoMessage extends Message {
  constructor(args) {
    super(args);
    [this.data.src,
      this.data.type,
      this.data.description
    ] = [args.src, 'video', args.description];
  }
}

export class AudioMessage extends Message {
  constructor(args) {
    super(args);
    [this.data.src,
      this.data.type,
      this.data.description
    ] = [args.src, 'audio', args.description];
  }
}

export class PdfMessage extends Message {
  constructor(args) {
    super(args);
    [this.data.src,
      this.data.type,
      this.data.description
    ] = [args.src, 'pdf', args.description];
  }
}

export class FileMessage extends Message {
  constructor(args) {
    super(args);
    [this.data.src,
      this.data.type,
      this.data.description
    ] = [args.src, 'file', args.description];
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