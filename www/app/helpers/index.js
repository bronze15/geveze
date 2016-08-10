import * as custom_faker from "./custom_faker";
import {
  Fake
}
from "./custom_faker";
import {
  Bitmap
}
from "./bitmap";

var faker = require('faker');

class AvatarImage {
  constructor(args) {

    args = args || {};
    this.bitmap = new Bitmap();
    this.src = this.new(
      args.size || 24, Fake.int({
        min: args.min || 3,
        max: args.max || 3
      }));

    this.args = args;
  }

  renew() {
    this.src = this.new(
      this.args.size || 24, Fake.int({
        min: this.args.min || 3,
        max: this.args.max || 3
      }));
  }

  new(width, squares) {
    return this.bitmap.new(this.rows(squares), this.scale(width, squares));
  }

  dom() {

    let filename = `${faker.random.uuid()}.bmp`;
    let img = document.createElement("img");
    img.setAttribute("src", this.src);
    img.setAttribute('data-uuid', filename);
    img.classList.add("avatar");

    img.onclick = function() {
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
        var bb = new(window.WebKitBlobBuilder || window.MozBlobBuilder);
        bb.append(arraybuffer);
        var blob = bb.getBlob('application/octet-stream'); // <-- Here's the Blob
      }

      // Use the URL object to create a temporary URL
      var url = (window.URL).createObjectURL(blob);

      var link = document.createElement("a");

      console.log(filename);
      link.download = img.getAttribute('data-uuid');
      link.href = url;
      link.click();
    }

    return img;
  }

  rows(squares = 5) {

    let arr = [];

    let colors = [
      [0xf0, 0xf0, 0xf0],
      [Fake.int({
        min: 0,
        max: 255
      }), Fake.int({
        min: 0,
        max: 255
      }), Fake.int({
        min: 0,
        max: 255
      })]
    ];


    for (let i = 0; i < squares; i++) {
      arr.push([]);
      for (let j = 0; j < squares; j++) {
        arr[i][j] = colors[Fake.int({
          min: 0,
          max: 2
        })];
      }
    }
    return arr;
  }

  scale(width = 24, squares = 3) {
    return width / squares;
  }

}

module.exports = {
  custom_faker: custom_faker,
  AvatarImage: AvatarImage
}