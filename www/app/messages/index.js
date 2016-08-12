var faker = require('faker');

export class Message {

  constructor(args) {
    this.data = args.data || {};
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
