(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("example.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var data = exports.data = {
  messages: ['✋', '😁', 'hi...', 'www.google.com', 'mailto:serefguneysu@gmail.com', "intent://scan/#Intent;scheme=zxing;package=com.google.zxing.client.android;S.browser_fallback_url=http%3A%2F%2Fzxing.org;end", "intent://scan/#Intent;scheme=zxing;package=com.google.zxing.client.android;end"],

  images: ['http://placehold.it/200x200/bbaaaa/ffffff?text=image-1', 'http://placehold.it/200x200/aabbaa/ffffff?text=image-2', 'http://placehold.it/200x200/aaaabb/ffffff?text=image-3'],
  videos: ['http://www.sample-videos.com/video/mkv/240/big_buck_bunny_240p_1mb.mkv', 'http://www.sample-videos.com/video/mp4/240/big_buck_bunny_240p_1mb.mp4'],
  audios: ['http://www.w3schools.com/html/horse.ogg'],
  pdfs: ['http://www.publishers.org.uk/_resources/assets/attachment/full/0/2091.pdf'],
  files: ['http://humanstxt.org/humans.txt']
};
});

;require.register("exceptions/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NotImplementedException = exports.NotImplementedException = function (_Error) {
    _inherits(NotImplementedException, _Error);

    function NotImplementedException(args) {
        _classCallCheck(this, NotImplementedException);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NotImplementedException).call(this));

        _this.message = 'Not Implemented';
        return _this;
    }

    return NotImplementedException;
}(Error);
});

;require.register("geveze.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Geveze = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _socket = require("socket");

var socket = _interopRequireWildcard(_socket);

var _helpers = require("helpers");

var helpers = _interopRequireWildcard(_helpers);

var _messages = require("messages");

var messages = _interopRequireWildcard(_messages);

var _exceptions = require("exceptions");

var exceptions = _interopRequireWildcard(_exceptions);

var _example = require("example");

var example = _interopRequireWildcard(_example);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var faker = require('faker');

var Geveze = exports.Geveze = function () {
  function Geveze(args) {
    _classCallCheck(this, Geveze);

    this._settings = args.settings || {
      recover: false
    };
    this.avatar = new helpers.AvatarImage();

    this.url = args.url;
    this._retry_interval = 0.5;
    this.connect();
  }

  _createClass(Geveze, [{
    key: "sendAvatar",
    value: function sendAvatar() {
      console.debug('sendAvatar();');
    }
  }, {
    key: "connect",
    value: function connect() {
      var _this = this;

      this.ws = new WebSocket(this.url);

      this.ws.onopen = function (evt) {
        if (_this.settings.log) console.debug("connection opened: " + evt.target.url + "}");
        var ws = evt.target;
        ws.send('ahmwed');
      };

      this.ws.addEventListener('open', function (e) {
        if (_this.settings.send_avatar) _this.sendAvatar();
      });

      this.ws.onclose = function (evt) {
        if (_this.settings.log) console.warn("closed: " + evt.target.url + "}. code: " + evt.code + " reason: " + evt.reason + ".");

        if (_this.settings.recover) {
          _this.retry_interval *= 2.0;
          setTimeout(function () {
            console.warn("connection can not be established. trying in " + _this.retry_interval + " seconds.");
            _this.connect();
          }, _this.retry_interval * 1000.0);
        }
      };

      this.ws.onmessage = function (evt) {
        var data = JSON.parse(evt.data);
        _this.update_ui(data);
      };

      this.ws.addEventListener('message', function (evt) {
        switch (_this.settings.log) {
          case "short":
            console.debug({
              type: data.type,
              uuid: data.uuid,
              room: data.room,
              src: data.src,
              sender: data.sender,
              time: data.date,
              body: data.body,
              users: data.users
            });
            break;
          case "verbose":
            console.debug(data);
            break;
          default:
            break;
        }
      });

      this.ws.onerror = function (evt) {
        var data = evt.data;
        console.error(data);
      };
    }
  }, {
    key: "send",
    value: function send(data) {
      var _this2 = this;

      this.update_ui(data);

      setTimeout(function () {
        _this2.ws.send(JSON.stringify(data));
      }, this.settings.slow_down);
    }
  }, {
    key: "update_ui",
    value: function update_ui(data) {
      console.debug(data);
    }
  }, {
    key: "is_me",
    value: function is_me(data) {
      return data.sender === this.uuid;
    }
  }, {
    key: "close",
    value: function close() {
      this.ws.close();
    }
  }, {
    key: "retry_interval",
    get: function get() {
      return this._retry_interval;
    },
    set: function set(value) {
      this._retry_interval = value;
    }
  }, {
    key: "settings",
    get: function get() {
      return this._settings;
    },
    set: function set(value) {
      this._settings = value;
    }
  }, {
    key: "uuid",
    get: function get() {
      return this._uuid;
    },
    set: function set(value) {
      this._uuid = value;
    }
  }]);

  return Geveze;
}();

var ClientEvents = {
  send_avatar: 'send_avatar',
  get_avatars: 'get_avatars',
  send_text: 'send_text',
  send_image: 'send_image',
  send_video: 'send_video',
  send_audio: 'send_audio',
  send_pdf: 'send_pdf',
  send_file: 'send_file'
};

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
  send_onlineusers: 'send_onlineusers'
};
});

;require.register("helpers/bitmap.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bitmap = exports.Bitmap = function () {
  function Bitmap() {
    _classCallCheck(this, Bitmap);
  }

  _createClass(Bitmap, [{
    key: 'new',

    /**
     * Created by ahmed on 8/6/16.
     */

    /*!
     * Generate Bitmap Data URL
     * http://mrcoles.com/low-res-paint/
     *
     * Copyright 2010, Peter Coles
     * Licensed under the MIT licenses.
     * http://mrcoles.com/media/mit-license.txt
     *
     * Date: Tue Oct 26 00:00:00 2010 -0500
     */

    /*
     * Code to generate Bitmap images (using data urls) from rows of RGB arrays.
     * Specifically for use with http://mrcoles.com/low-rest-paint/
     *
     * Research:
     *
     * RFC 2397 data URL
     * http://www.xs4all.nl/~wrb/Articles/Article_IMG_RFC2397_P1_01.htm
     *
     * BMP file Format
     * http://en.wikipedia.org/wiki/BMP_file_format#Example_of_a_2.C3.972_Pixel.2C_24-Bit_Bitmap_.28Windows_V3_DIB.29
     *
     * BMP Notes
     *
     * - Integer values are little-endian, including RGB pixels, e.g., (255, 0, 0) -> \x00\x00\xFF
     * - Bitmap data starts at lower left (and reads across rows)
     * - In the BMP data, padding bytes are inserted in order to keep the lines of data in multiples of four,
     *   e.g., a 24-bit bitmap with width 1 would have 3 bytes of data per row (R, G, B) + 1 byte of padding
     */

    value: function _new(rows, scale) {
      // Expects rows starting in bottom left
      // formatted like this: [[[255, 0, 0], [255, 255, 0], ...], ...]
      // which represents: [[red, yellow, ...], ...]

      if (!window.btoa) {
        console.error('Oh no, your browser does not support base64 encoding - window.btoa()!!');
        return false;
      }

      scale = scale || 1;
      if (scale != 1) {
        rows = Bitmap._scaleRows(rows, scale);
      }

      var height = rows.length,
          // the number of rows
      width = height ? rows[0].length : 0,
          // the number of columns per row
      row_padding = (4 - width * 3 % 4) % 4,
          // pad each row to a multiple of 4 bytes
      num_data_bytes = (width * 3 + row_padding) * height,
          // size in bytes of BMP data
      num_file_bytes = 54 + num_data_bytes,
          // full header size (offset) + size of data
      file;

      height = Bitmap._asLittleEndianHex(height, 4);
      width = Bitmap._asLittleEndianHex(width, 4);
      num_data_bytes = Bitmap._asLittleEndianHex(num_data_bytes, 4);
      num_file_bytes = Bitmap._asLittleEndianHex(num_file_bytes, 4);

      // these are the actual bytes of the file...

      file = 'BM' + // "Magic Number"
      num_file_bytes + // size of the file (bytes)*
      '\x00\x00' + // reserved
      '\x00\x00' + // reserved
      '\x36\x00\x00\x00' + // offset of where BMP data lives (54 bytes)
      '\x28\x00\x00\x00' + // number of remaining bytes in header from here (40 bytes)
      width + // the width of the bitmap in pixels*
      height + // the height of the bitmap in pixels*
      '\x01\x00' + // the number of color planes (1)
      '\x18\x00' + // 24 bits / pixel
      '\x00\x00\x00\x00' + // No compression (0)
      num_data_bytes + // size of the BMP data (bytes)*
      '\x13\x0B\x00\x00' + // 2835 pixels/meter - horizontal resolution
      '\x13\x0B\x00\x00' + // 2835 pixels/meter - the vertical resolution
      '\x00\x00\x00\x00' + // Number of colors in the palette (keep 0 for 24-bit)
      '\x00\x00\x00\x00' + // 0 important colors (means all colors are important)
      Bitmap._collapseData(rows, row_padding);

      return 'data:image/bmp;base64,' + btoa(file);
    }
  }], [{
    key: '_asLittleEndianHex',
    value: function _asLittleEndianHex(value, bytes) {
      /*
      Convert value into little endian hex bytes
      value - the number as a decimal integer (representing bytes)
      bytes - the number of bytes that this value takes up in a string
       Example:
      _asLittleEndianHex(2835, 4)
      > '\x13\x0b\x00\x00'
      */

      var result = [];

      for (; bytes > 0; bytes--) {
        result.push(String.fromCharCode(value & 255));
        value >>= 8;
      }

      return result.join('');
    }
  }, {
    key: '_collapseData',
    value: function _collapseData(rows, row_padding) {
      // Convert rows of RGB arrays into BMP data
      var i,
          rows_len = rows.length,
          j,
          pixels_len = rows_len ? rows[0].length : 0,
          pixel,
          padding = '',
          result = [];

      for (; row_padding > 0; row_padding--) {
        padding += '\x00';
      }

      for (i = 0; i < rows_len; i++) {
        for (j = 0; j < pixels_len; j++) {
          pixel = rows[i][j];
          result.push(String.fromCharCode(pixel[2]) + String.fromCharCode(pixel[1]) + String.fromCharCode(pixel[0]));
        }
        result.push(padding);
      }

      return result.join('');
    }
  }, {
    key: '_scaleRows',
    value: function _scaleRows(rows, scale) {
      // Simplest scaling possible
      var real_w = rows.length,
          scaled_w = parseInt(real_w * scale),
          real_h = real_w ? rows[0].length : 0,
          scaled_h = parseInt(real_h * scale),
          new_rows = [],
          new_row,
          x,
          y;

      for (y = 0; y < scaled_h; y++) {
        new_rows.push(new_row = []);
        for (x = 0; x < scaled_w; x++) {
          new_row.push(rows[parseInt(y / scale)][parseInt(x / scale)]);
        }
      }
      return new_rows;
    }
  }]);

  return Bitmap;
}();
});

;require.register("helpers/custom_faker.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Fake = exports.Fake = {
  bool: function bool(args) {
    /**
     * http://jsfiddle.net/Ronny/Ud5vT/
     */

    return Math.random() < .5; // Readable, succint
  },

  date: function date(args) {
    /**
     *
     * http://stackoverflow.com/a/9035732/1766716
     * */
    return new Date(args.start.getTime() + Math.random() * (args.end.getTime() - args.start.getTime()));
  },

  float: function float(args) {
    return args.min + Math.random() * (args.max - args.min);
  },

  int: function int(args) {
    /*
     * USAGE
     * Fake.({max:10, min:3});
     *
     */
    return Fake.float(args) | 0;
  },
  select: function select(list) {
    /*
     * USAGE
     * Fake.select(list);
     *
     */
    var index = Fake.int({
      min: 0,
      max: list.length
    });
    return list[index];
  }
};
});

require.register("helpers/index.js", function(exports, require, module) {
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _custom_faker = require("./custom_faker");

var custom_faker = _interopRequireWildcard(_custom_faker);

var _bitmap = require("./bitmap");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var faker = require('faker');

var AvatarImage = function () {
  function AvatarImage(args) {
    _classCallCheck(this, AvatarImage);

    args = args || {};
    this.bitmap = new _bitmap.Bitmap();
    this.src = this.new(args.size || 24, _custom_faker.Fake.int({
      min: args.min || 3,
      max: args.max || 3
    }));

    this.args = args;
  }

  _createClass(AvatarImage, [{
    key: "renew",
    value: function renew() {
      this.src = this.new(this.args.size || 24, _custom_faker.Fake.int({
        min: this.args.min || 3,
        max: this.args.max || 3
      }));
    }
  }, {
    key: "new",
    value: function _new(width, squares) {
      return this.bitmap.new(this.rows(squares), this.scale(width, squares));
    }
  }, {
    key: "dom",
    value: function dom() {

      var filename = faker.random.uuid() + ".bmp";
      var img = document.createElement("img");
      img.setAttribute("src", this.src);
      img.setAttribute('data-uuid', filename);
      img.classList.add("avatar");

      img.onclick = function () {
        // atob to base64_decode the data-URI
        var image_data = atob(img.src.split(',')[1]);
        // Use typed arrays to convert the binary data to a Blob
        var arraybuffer = new ArrayBuffer(image_data.length);
        var view = new Uint8Array(arraybuffer);
        for (var i = 0; i < image_data.length; i++) {
          view[i] = image_data.charCodeAt(i) & 0xff;
        }
        try {
          // This is the recommended method:
          var blob = new Blob([arraybuffer], {
            type: 'application/octet-stream'
          });
        } catch (e) {
          // The BlobBuilder API has been deprecated in favour of Blob, but older
          // browsers don't know about the Blob constructor
          // IE10 also supports BlobBuilder, but since the `Blob` constructor
          //  also works, there's no need to add `MSBlobBuilder`.
          var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder)();
          bb.append(arraybuffer);
          var blob = bb.getBlob('application/octet-stream'); // <-- Here's the Blob
        }

        // Use the URL object to create a temporary URL
        var url = window.URL.createObjectURL(blob);

        var link = document.createElement("a");

        console.log(filename);
        link.download = img.getAttribute('data-uuid');
        link.href = url;
        link.click();
      };

      return img;
    }
  }, {
    key: "rows",
    value: function rows() {
      var squares = arguments.length <= 0 || arguments[0] === undefined ? 5 : arguments[0];


      var arr = [];

      var colors = [[0xf0, 0xf0, 0xf0], [_custom_faker.Fake.int({
        min: 0,
        max: 255
      }), _custom_faker.Fake.int({
        min: 0,
        max: 255
      }), _custom_faker.Fake.int({
        min: 0,
        max: 255
      })]];

      for (var i = 0; i < squares; i++) {
        arr.push([]);
        for (var j = 0; j < squares; j++) {
          arr[i][j] = colors[_custom_faker.Fake.int({
            min: 0,
            max: 2
          })];
        }
      }
      return arr;
    }
  }, {
    key: "scale",
    value: function scale() {
      var width = arguments.length <= 0 || arguments[0] === undefined ? 24 : arguments[0];
      var squares = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];

      return width / squares;
    }
  }]);

  return AvatarImage;
}();

module.exports = {
  custom_faker: custom_faker,
  AvatarImage: AvatarImage
};
});

;require.register("initialize.js", function(exports, require, module) {
"use strict";

var _messages = require("messages");

var messages = _interopRequireWildcard(_messages);

var _socket = require("socket");

var socket = _interopRequireWildcard(_socket);

var _helpers = require("helpers");

var helpers = _interopRequireWildcard(_helpers);

var _geveze = require("./geveze");

var geveze = _interopRequireWildcard(_geveze);

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

window.$ = require('jquery');
window.jQuery = _jquery2.default;
window.Vue = require('vue');
window.faker = require('faker');

document.addEventListener('DOMContentLoaded', function () {
  console.info('Initialized app');

  // avatarFun();

  window.application = new Vue({
    el: '#app',
    data: {
      plain: [],
      avatar: {},
      subscribed: [],
      unsubscribed: []
    }
  });
});

window.apps = [];

var N = 1;

window.__1000 = null;

var settings = {
  recover: false,
  test: false,
  log: "short",
  send_avatar: true,
  slow_down: 800.0
};

for (var i = 0; i < N; i++) {

  __1000 = new geveze.Geveze({
    url: "ws://localhost:8888/rooms/1000/ws?id=" + i,
    settings: settings
  });

  apps.push(__1000);
}

(0, _jquery2.default)(document).ready(function () {
  if (!window.console) window.console = {};
  if (!window.console.log) window.console.log = function () {};

  (0, _jquery2.default)("#messageform").on("submit", function () {
    send((0, _jquery2.default)(this));
    return false;
  });
  (0, _jquery2.default)("#messageform").on("keypress", function (e) {
    if (e.keyCode == 13) {
      send((0, _jquery2.default)(this));
      return false;
    }
  });
  (0, _jquery2.default)("#message").select(); // for mobile debugging UX, disable focus
});

function send(form) {
  var message = form.formToDict();
  if (message.body === "") return;
  window.__1000.sendMessage(message.body);
  form.find("input[type=text]").val("").select();
}

jQuery.fn.formToDict = function () {
  var fields = this.serializeArray();
  var json = {};
  for (var i = 0; i < fields.length; i++) {
    json[fields[i].name] = fields[i].value;
  }
  if (json.next) delete json.next;
  return json;
};
});

require.register("messages/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var faker = require('faker');

var Message = exports.Message = function () {
  function Message(args) {
    _classCallCheck(this, Message);

    this.data = args.data || {};
    this.data['uuid'] = faker.random.uuid();
  }

  _createClass(Message, [{
    key: 'cookie',
    value: function cookie(name) {
      var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
      return r ? r[1] : undefined;
    }
  }, {
    key: 'xsrf',
    get: function get() {
      return this.cookie('_xsrf');
    }
  }, {
    key: 'data',
    set: function set(value) {
      this._data = value;
    },
    get: function get() {
      return this._data;
    }
  }, {
    key: 'json',
    get: function get() {
      return JSON.stringify(this.data);
    }
  }]);

  return Message;
}();
});

;require.register("socket/events.js", function(exports, require, module) {
'use strict';

var faker = require('faker');

var onopen = function onopen(evt) {
  var msg = 'connection opened: ' + evt.target.url + '}';
  var ws = evt.target;
  ws.send(JSON.stringify({}));
  console.info(msg);
};

var onclose = function onclose(evt) {
  var msg = 'connection closed: ' + evt.target.url + '}';
  console.warn(msg);
};

var onmessage = function onmessage(evt) {
  var data = JSON.parse(evt.data);
  // data.date = new Date(data.date);
  console.table([data]);
};

var onerror = function onerror(evt) {
  var data = evt.data;
  console.warn(data);
};

module.exports = {
  onopen: onopen,
  onclose: onclose,
  onmessage: onmessage,
  onerror: onerror
};
});

require.register("socket/index.js", function(exports, require, module) {
"use strict";

var _events = require("socket/events");

var events = _interopRequireWildcard(_events);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Connection = function Connection(args) {
  _classCallCheck(this, Connection);

  this.ws = new WebSocket(args.url);
  var _ref = [args.onopen, args.onclose, args.onerror, args.onmessage];
  this.ws.onopen = _ref[0];
  this.ws.onclose = _ref[1];
  this.ws.onerror = _ref[2];
  this.ws.onmessage = _ref[3];
};

module.exports = {
  events: events,
  Connection: Connection
};
});

;require.alias("brunch/node_modules/deppack/node_modules/node-browser-modules/node_modules/process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map