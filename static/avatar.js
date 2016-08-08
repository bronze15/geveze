/**
 * Created by ahmed on 8/6/16.
 */


let patterns = {
  x2: {
    p1:  [[ [255, 0, 0], [255, 255, 255]],[ [0, 0, 255], [0, 255, 0]] ],
    p2:  [[ [100, 100, 100], [100, 100, 100]],[ [100, 100, 100], [100, 100, 100]] ],
    p3:  [[ [0, 0, 0], [0, 0, 0]],[ [0, 0, 0], [0, 0, 0]] ],
  }
};


function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays,{
        type: contentType
    });
    return blob;
}

var Fake = {
  bool: function(args) {
    /**
     * http://jsfiddle.net/Ronny/Ud5vT/
     */

    return Math.random() < .5; // Readable, succint
  },

  date: function(args) {
    /**
     *
     * http://stackoverflow.com/a/9035732/1766716
     * */
    return new Date(args.start.getTime() + Math.random() * (args.end.getTime() - args.start.getTime()));
  },

  float: function(args) {
    return args.min + Math.random() * (args.max - args.min);
  },

  int: function(args) {
    /*
     * USAGE
     * Fake.({max:10, min:3});
     *
     */
    return Fake.float(args) | 0;
  },
  select: function(list) {
    /*
     * USAGE
     * Fake.select(list);
     *
     */
    let index = Fake.int({
      min: 0,
      max: list.length
    });
    return list[index];
  }
};

class Avatar {
  constructor() {
    if (!localStorage.getItem('avatar')) localStorage.setItem('avatar', this.newAvatar());
    if (!localStorage.getItem('guid')) localStorage.setItem('guid', this.guid());

  }


  placeholder(){
    let pattern = patterns.x2.p2;
    return generateBitmapDataURL(pattern, 24 / 2);
    return this.newAvatar();
  }

  as_blob(){
    let b64 = this.avatarUrl();
    let b64Data = b64.split(',')[1];
    let blob = b64toBlob(b64Data, 'image/bmp');
    return blob;
  }
  
  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }


  newAvatarArray(size) {
    let arr = [];

    for (let i = 0; i < size; i++) {
      arr.push([]);
      for (let j = 0; j < size; j++) {

        let point = [0xc0, 0xc0, 0xc0];

        point[Fake.int({
          min: 0,
          max: 3
        })] = Fake.select([0, 64, 128, 255]);
        point[Fake.int({
          min: 0,
          max: 3
        })] = Fake.select([0, 64, 128, 255]);
        point[Fake.int({
          min: 0,
          max: 3
        })] = Fake.select([0, 64, 128, 255]);

        arr[i][j] = point;
      }
    }
    return arr;
  }

  newAvatar() {
    let size = Fake.select([3, 4]);
    this.avatarArray = this.newAvatarArray(size);
    return generateBitmapDataURL(this.avatarArray, 24 / size);
  }

  newElement() {
    let url = this.newAvatar();
    let el = document.createElement("img");
    el.setAttribute("src", url);
    return el;
  }

  avatarUrl() {
    return localStorage.getItem('avatar');
  }

  myGuid() {
    return localStorage.getItem('guid');
  }

  avatarElement() {

    let src = this.avatarUrl();

    let el = document.createElement('img');

    el.setAttribute('src', src);
    el.classList.add("avatar");
    return el;
  }

}