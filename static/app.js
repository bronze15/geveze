/**
 * Created by ahmed on 8/5/16.
 */


class ChatApp {
    constructor(args) {
        this.url = "ws://localhost:8888/chat";

        this.ws_wrapper = new WSWrapper({
            url: this.url
        });


        this.data_handlers = {
            json: new JsonDataHandler(),
            blob: new BlobDataHandler(),
            image: new ImageDataHandler(),
            text: new TextDataHandler(),
            base64: new Base64DataHandler(),
        };

        this.initialize();
    }

    initialize() {
        this.ws = this.ws_wrapper.factory();
        // this.bind_events(this.ws_wrapper.empty_events());
        this.bind_events(this.ws_wrapper.default_events());
    }

    bind_events(events) {
        [this.ws.onopen, this.ws.onmessage, this.ws.onclose] =
            [events.onopen, events.onmessage, events.onclose];

    }

    send(data) {
        this.ws.send(data);
    }

    close() {
        this.ws.close();
    }

    open() {
        this.initialize();
    }
}

class WSWrapper {
    constructor(args) {
        this.url = args.url;
    }

    factory() {
        return new WebSocket(this.url);
    }

    default_events() {
        return {
            onopen: (evt) => {
                console.info("Connection Opened.");
            },
            onmessage: (evt) => {
                console.info(evt.data);
            },
            onclose: (evt) => {
                console.warn(`Connection Closed. code:${evt.code} | reason ${evt.reason}`);
            }
        };
    }
}

class NotImplementedException extends Error {
    constructor(args) {
        super();
        this.message = 'Not Implemented';
    }
}

class DataHandler {
    serialize(data) {
        throw new NotImplementedException();
    }

    deserialize(data) {
        throw new NotImplementedException();
    }
}

class BlobDataHandler extends DataHandler {
    constructor(args) {
        super();
    }
}

class JsonDataHandler extends DataHandler {
    constructor(args) {
        super();
    }

    serialize(data) {
        return JSON.stringify(data);
    };

    deserialize(data) {
        return JSON.parse(data);
    }
}


class ImageDataHandler extends DataHandler {
    constructor(args) {
        super();
    }

    serialize(data) {
        var blob = new Blob(data, {
            type: "image/png"
        });
        return blob;
    }
}



class Base64DataHandler extends DataHandler {
    constructor(args) {
        super();
        this._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    }
    serialize(e) {
        e = e.replace(/rn/g, "n");
        let t = "";
        for (let n = 0; n < e.length; n++) {
            let r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t;
    }

    deserialize(e) {
        let t = "";
        let n = 0;
        let r, c1, c2;

        [r, c1, c2] = [0, 0, 0];

        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t;
    }
}
class NativeBase64DataHandler extends DataHandler {
    constructor(args) {
        super();
    }
    serialize(data) {
        return window.btoa(data);
    }

    deserialize(data) {
        return window.atob(data);
    }
}

class TextDataHandler extends DataHandler {
    constructor(args) {
        super();
    }

    serialize(data) {
        throw NotImplementedException();
        var blob = new Blob(data, {
            type: "text/plain"
        });
        return blob;
    }

}
