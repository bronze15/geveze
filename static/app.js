!function(){"use strict";var e="undefined"==typeof window?global:window;if("function"!=typeof e.require){var t={},n={},r={},o={}.hasOwnProperty,i=/^\.\.?(\/|$)/,a=function(e,t){for(var n,r=[],o=(i.test(t)?e+"/"+t:t).split("/"),a=0,s=o.length;a<s;a++)n=o[a],".."===n?r.pop():"."!==n&&""!==n&&r.push(n);return r.join("/")},s=function(e){return e.split("/").slice(0,-1).join("/")},c=function(t){return function(n){var r=a(s(t),n);return e.require(r,t)}},d=function(e,t){var r=null;r=w&&w.createHot(e);var o={id:e,exports:{},hot:r};return n[e]=o,t(o.exports,c(e),o),o.exports},u=function(e){return r[e]?u(r[e]):e},l=function(e,t){return u(a(s(e),t))},f=function(e,r){null==r&&(r="/");var i=u(e);if(o.call(n,i))return n[i].exports;if(o.call(t,i))return d(i,t[i]);throw new Error("Cannot find module '"+e+"' from '"+r+"'")};f.alias=function(e,t){r[t]=e};var p=/\.[^.\/]+$/,m=/\/index(\.[^\/]+)?$/,v=function(e){if(p.test(e)){var t=e.replace(p,"");o.call(r,t)&&r[t].replace(p,"")!==t+"/index"||(r[t]=e)}if(m.test(e)){var n=e.replace(m,"");o.call(r,n)||(r[n]=e)}};f.register=f.define=function(e,r){if("object"==typeof e)for(var i in e)o.call(e,i)&&f.register(i,e[i]);else t[e]=r,delete n[e],v(e)},f.list=function(){var e=[];for(var n in t)o.call(t,n)&&e.push(n);return e};var w=e._hmr&&new e._hmr(l,f,t,n);f._cache=n,f.hmr=w&&w.wrap,f.brunch=!0,e.require=f}}(),function(){var e;window;require.register("example.js",function(e,t,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.data={messages:["✋","😁","hi...","www.google.com","mailto:serefguneysu@gmail.com","intent://scan/#Intent;scheme=zxing;package=com.google.zxing.client.android;S.browser_fallback_url=http%3A%2F%2Fzxing.org;end","intent://scan/#Intent;scheme=zxing;package=com.google.zxing.client.android;end"],images:["http://placehold.it/200x200/bbaaaa/ffffff?text=image-1","http://placehold.it/200x200/aabbaa/ffffff?text=image-2","http://placehold.it/200x200/aaaabb/ffffff?text=image-3"],videos:["http://www.sample-videos.com/video/mkv/240/big_buck_bunny_240p_1mb.mkv","http://www.sample-videos.com/video/mp4/240/big_buck_bunny_240p_1mb.mp4"],audios:["http://www.w3schools.com/html/horse.ogg"],pdfs:["http://www.publishers.org.uk/_resources/assets/attachment/full/0/2091.pdf"],files:["http://humanstxt.org/humans.txt"]}}),require.register("exceptions/index.js",function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(e,"__esModule",{value:!0});e.NotImplementedException=function(e){function t(e){r(this,t);var n=o(this,Object.getPrototypeOf(t).call(this));return n.message="Not Implemented",n}return i(t,e),t}(Error)}),require.register("geveze.js",function(e,t,n){"use strict";function r(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t["default"]=e,t}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0}),e.Geveze=void 0;var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=t("helpers"),s=r(a),c=t("messages"),d=(r(c),t("exceptions")),u=(r(d),t("example")),l=(r(u),t("faker")),f={send_avatar:"send_avatar",get_onlineusers:"get_onlineusers",get_avatars:"get_avatars",send_text:"send_text",send_image:"send_image",send_video:"send_video",send_audio:"send_audio",send_pdf:"send_pdf",send_file:"send_file"},p={subscribed:"subscribed",unsubscribed:"unsubscribed",send_uuid:"send_uuid",send_avatars:"send_avatars",send_avatar:"send_avatar",send_text:"send_text",send_image:"send_image",send_video:"send_video",send_audio:"send_audio",send_pdf:"send_pdf",send_file:"send_file",send_onlineusers:"send_onlineusers"};e.Geveze=function(){function e(t){o(this,e),this._settings=t.settings||{recover:!1},this.avatar=new s.AvatarImage,this.url=t.url,this._app=t.app,this._retry_interval=.5,this.connect()}return i(e,[{key:"sendAvatar",value:function(){this.send({type:f.send_avatar,src:this.avatar.src}),console.debug("sendAvatar();")}},{key:"getOnlineUsers",value:function(){this.send({type:f.get_onlineusers}),console.debug("getOnlineUsers();")}},{key:"connect",value:function(){var e=this;this.ws=new WebSocket(this.url),this.ws.onopen=function(t){e.settings.log&&console.debug("connection opened: "+t.target.url+"}");t.target},this.ws.addEventListener("open",function(t){e.settings.send_avatar&&e.sendAvatar()}),this.ws.addEventListener("open",function(t){e.send({type:f.get_avatars})}),this.ws.onclose=function(t){e.settings.log&&console.warn("closed: "+t.target.url+"}. code: "+t.code+" reason: "+t.reason+"."),e.settings.recover&&(e.retry_interval*=2,setTimeout(function(){console.warn("connection can not be established. trying in "+e.retry_interval+" seconds."),e.connect()},1e3*e.retry_interval))},this.ws.onmessage=function(t){var n=JSON.parse(t.data);e.broker(n)},this.ws.addEventListener("message",function(t){var n=JSON.parse(t.data);switch(e.settings.log){case"short":console.debug({type:n.type,uuid:n.uuid,room:n.room,src:n.src,sender:n.sender,time:n.date,body:n.body,users:n.users});break;case"verbose":console.debug(n)}}),this.ws.onerror=function(e){var t=e.data;console.error(t)}}},{key:"send",value:function(e){var t=this;switch(e.type){case f.send_text:var n=[{src:this.avatar.src},!0];e.avatar=n[0],e.is_me=n[1],this.app.messages.push(e),setTimeout(function(){t.ws.send(JSON.stringify(e))},this.settings.slow_down);break;default:this.ws.send(JSON.stringify(e))}}},{key:"message",value:function(e){this.send({body:e,type:f.send_text,uuid:l.random.uuid()})}},{key:"broker",value:function(e){switch(console.debug("data type: "+e.type),console.debug(e),e.type){case p.send_uuid:this.uuid=e.uuid;break;case p.send_avatar:this.app.avatar[e.sender]=e.src,this.getOnlineUsers();break;case p.send_avatars:for(var t in e.avatars)this.app.avatar[t]=e.avatars[t];break;case f.send_text:var n=[{src:this.app.avatar[e.sender]},this.is_me(e)];e.avatar=n[0],e.is_me=n[1],this.app.messages.push(e);break;case p.send_onlineusers:this.app.online_users={};var r=!0,o=!1,i=void 0;try{for(var a,s=e.online_users[Symbol.iterator]();!(r=(a=s.next()).done);r=!0){var c=a.value;this.app.online_users[c]={avatar:this.app.avatar[c]}}}catch(d){o=!0,i=d}finally{try{!r&&s["return"]&&s["return"]()}finally{if(o)throw i}}}}},{key:"is_me",value:function(e){return e.sender===this.uuid}},{key:"close",value:function(){this.ws.close()}},{key:"app",get:function(){return this._app},set:function(e){this._app=e}},{key:"retry_interval",get:function(){return this._retry_interval},set:function(e){this._retry_interval=e}},{key:"settings",get:function(){return this._settings},set:function(e){this._settings=e}},{key:"uuid",get:function(){return this._uuid},set:function(e){this._uuid=e}}]),e}()}),require.register("helpers/bitmap.js",function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();e.Bitmap=function(){function e(){r(this,e)}return o(e,[{key:"new",value:function(t,n){if(!window.btoa)return console.error("Oh no, your browser does not support base64 encoding - window.btoa()!!"),!1;n=n||1,1!=n&&(t=e._scaleRows(t,n));var r,o=t.length,i=o?t[0].length:0,a=(4-3*i%4)%4,s=(3*i+a)*o,c=54+s;return o=e._asLittleEndianHex(o,4),i=e._asLittleEndianHex(i,4),s=e._asLittleEndianHex(s,4),c=e._asLittleEndianHex(c,4),r="BM"+c+"\0\0\0\x006\0\0\0(\0\0\0"+i+o+"\0\0\0\0\0\0"+s+"\x0B\0\0\x0B\0\0\0\0\0\0\0\0\0\0"+e._collapseData(t,a),"data:image/bmp;base64,"+btoa(r)}}],[{key:"_asLittleEndianHex",value:function(e,t){for(var n=[];t>0;t--)n.push(String.fromCharCode(255&e)),e>>=8;return n.join("")}},{key:"_collapseData",value:function(e,t){for(var n,r,o,i=e.length,a=i?e[0].length:0,s="",c=[];t>0;t--)s+="\0";for(n=0;n<i;n++){for(r=0;r<a;r++)o=e[n][r],c.push(String.fromCharCode(o[2])+String.fromCharCode(o[1])+String.fromCharCode(o[0]));c.push(s)}return c.join("")}},{key:"_scaleRows",value:function(e,t){var n,r,o,i=e.length,a=parseInt(i*t),s=i?e[0].length:0,c=parseInt(s*t),d=[];for(o=0;o<c;o++)for(d.push(n=[]),r=0;r<a;r++)n.push(e[parseInt(o/t)][parseInt(r/t)]);return d}}]),e}()}),require.register("helpers/custom_faker.js",function(e,t,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=e.Fake={bool:function(e){return Math.random()<.5},date:function(e){return new Date(e.start.getTime()+Math.random()*(e.end.getTime()-e.start.getTime()))},"float":function(e){return e.min+Math.random()*(e.max-e.min)},"int":function(e){return 0|r["float"](e)},select:function(e){var t=r["int"]({min:0,max:e.length});return e[t]}}}),require.register("helpers/index.js",function(e,t,n){"use strict";function r(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t["default"]=e,t}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=t("./custom_faker"),s=r(a),c=t("./bitmap"),d=t("faker"),u=function(){function e(t){o(this,e),t=t||{},this.bitmap=new c.Bitmap,this.src=this["new"](t.size||24,a.Fake["int"]({min:t.min||3,max:t.max||3})),this.args=t}return i(e,[{key:"renew",value:function(){this.src=this["new"](this.args.size||24,a.Fake["int"]({min:this.args.min||3,max:this.args.max||3}))}},{key:"new",value:function(e,t){return this.bitmap["new"](this.rows(t),this.scale(e,t))}},{key:"dom",value:function(){var e=d.random.uuid()+".bmp",t=document.createElement("img");return t.setAttribute("src",this.src),t.setAttribute("data-uuid",e),t.classList.add("avatar"),t.onclick=function(){for(var n=atob(t.src.split(",")[1]),r=new ArrayBuffer(n.length),o=new Uint8Array(r),i=0;i<n.length;i++)o[i]=255&n.charCodeAt(i);try{var a=new Blob([r],{type:"application/octet-stream"})}catch(s){var c=new(window.WebKitBlobBuilder||window.MozBlobBuilder);c.append(r);var a=c.getBlob("application/octet-stream")}var d=window.URL.createObjectURL(a),u=document.createElement("a");console.log(e),u.download=t.getAttribute("data-uuid"),u.href=d,u.click()},t}},{key:"rows",value:function(){for(var e=arguments.length<=0||void 0===arguments[0]?5:arguments[0],t=[],n=[[240,240,240],[a.Fake["int"]({min:0,max:255}),a.Fake["int"]({min:0,max:255}),a.Fake["int"]({min:0,max:255})]],r=0;r<e;r++){t.push([]);for(var o=0;o<e;o++)t[r][o]=n[a.Fake["int"]({min:0,max:2})]}return t}},{key:"scale",value:function(){var e=arguments.length<=0||void 0===arguments[0]?24:arguments[0],t=arguments.length<=1||void 0===arguments[1]?3:arguments[1];return e/t}}]),e}();n.exports={custom_faker:s,AvatarImage:u}}),require.register("initialize.js",function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t["default"]=e,t}function i(e){var t=e.formToDict();""!==t.body&&(window.geveze.message(t.body),e.find("input[type=text]").val("").select())}var a=t("messages"),s=(o(a),t("helpers")),c=(o(s),t("./geveze")),d=o(c),u=t("jquery"),l=r(u);window.$=t("jquery"),window.jQuery=l["default"],window.Vue=t("vue"),window.faker=t("faker"),document.addEventListener("DOMContentLoaded",function(){console.info("Initialized app");var e={recover:!0,test:!1,log:"verbose",send_avatar:!0,slow_down:0},t=new Vue({el:"#app",data:{messages:[],avatar:{},online_users:{}}});window.geveze=new d.Geveze({url:"ws://localhost:8888/rooms/1000/ws?id="+faker.internet.userName(),settings:e,app:t})}),(0,l["default"])(document).ready(function(){window.console||(window.console={}),window.console.log||(window.console.log=function(){}),(0,l["default"])("#messageform").on("submit",function(){return i((0,l["default"])(this)),!1}),(0,l["default"])("#messageform").on("keypress",function(e){if(13==e.keyCode)return i((0,l["default"])(this)),!1}),(0,l["default"])("#message").select()}),jQuery.fn.formToDict=function(){for(var e=this.serializeArray(),t={},n=0;n<e.length;n++)t[e[n].name]=e[n].value;return t.next&&delete t.next,t}}),require.register("messages/index.js",function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=t("faker");e.Message=function(){function e(t){r(this,e),this.data=t.data||{},this.data.uuid=i.random.uuid()}return o(e,[{key:"cookie",value:function(e){var t=document.cookie.match("\\b"+e+"=([^;]*)\\b");return t?t[1]:void 0}},{key:"xsrf",get:function(){return this.cookie("_xsrf")}},{key:"data",set:function(e){this._data=e},get:function(){return this._data}},{key:"json",get:function(){return JSON.stringify(this.data)}}]),e}()}),require.register("video/app.js",function(e,t,n){"use strict";n.exports={}}),require.register("video/index.js",function(e,t,n){"use strict";t("adapterjs"),document.addEventListener("DOMContentLoaded",function(){window.notify=function(e,t){var n={body:e,icon:"https://developer.cdn.mozilla.net/static/img/favicon57.a2490b9a2d76.png"},r=new Notification(t||e,n);r.onclick=function(e){window.focus(),e.target.close()}},"Notification"in window&&Notification.requestPermission().then(function(e){console.debug=window.notify})}());var r=function(){var e=new WebSocket("wss://7a6907b0.ngrok.io/ws");return e};n.exports={wsFactory:r}}),require.register("video/recorder.js",function(e,t,n){"use strict";function r(e){console.log("getUserMedia() got stream: ",e),window.stream=e,window.URL?g.src=window.URL.createObjectURL(e):g.src=e}function o(e){console.log("navigator.getUserMedia error: ",e)}function i(e){console.log("MediaSource opened"),w=p.addSourceBuffer('video/webm; codecs="vp8"'),console.log("Source buffer: ",w)}function a(e){e.data&&e.data.size>0&&v.push(e.data)}function s(e){console.log("Recorder stopped: ",e)}function c(){"Start Recording"===b.textContent?d():(u(),b.textContent="Start Recording",y.disabled=!1,_.disabled=!1)}function d(){v=[];var e={mimeType:"video/webm;codecs=vp9"};MediaRecorder.isTypeSupported(e.mimeType)||(console.log(e.mimeType+" is not Supported"),e={mimeType:"video/webm;codecs=vp8"},MediaRecorder.isTypeSupported(e.mimeType)||(console.log(e.mimeType+" is not Supported"),e={mimeType:"video/webm"},MediaRecorder.isTypeSupported(e.mimeType)||(console.log(e.mimeType+" is not Supported"),e={mimeType:""})));try{m=new MediaRecorder(window.stream,e)}catch(t){return console.error("Exception while creating MediaRecorder: "+t),void alert("Exception while creating MediaRecorder: "+t+". mimeType: "+e.mimeType)}console.log("Created MediaRecorder",m,"with options",e),b.textContent="Stop Recording",y.disabled=!0,_.disabled=!0,m.onstop=s,m.ondataavailable=a,m.start(10),console.log("MediaRecorder started",m)}function u(){m.stop(),console.log("Recorded Blobs: ",v),h.controls=!0}function l(){var e=new Blob(v,{type:"video/webm"});h.src=window.URL.createObjectURL(e)}function f(){var e=new Blob(v,{type:"video/webm"}),t=window.URL.createObjectURL(e),n=document.createElement("a");n.style.display="none",n.href=t,n.download="video.webm",document.body.appendChild(n),n.click(),setTimeout(function(){document.body.removeChild(n),window.URL.revokeObjectURL(t)},100)}var p=new MediaSource;p.addEventListener("sourceopen",i,!1);var m,v,w,g=document.querySelector("video#gum"),h=document.querySelector("video#recorded"),b=document.querySelector("button#record"),y=document.querySelector("button#play"),_=document.querySelector("button#download");b.onclick=c,y.onclick=l,_.onclick=f;var k="https:"===location.protocol||"localhost"!==location.host;k||console.error("getUserMedia() must be run from a secure origin: HTTPS or localhost.");var x={audio:!0,video:!0};navigator.mediaDevices.getUserMedia(x).then(r)["catch"](o),h.addEventListener("error",function(e){console.error("MediaRecording.recordedMedia.error()"),alert("Your browser can not play\n\n"+h.src+"\n\n media clip. event: "+JSON.stringify(e))},!0),n.exports={}}),require.register("video/stream.js",function(e,t,n){"use strict";function r(e){console.log("MediaSource opened"),sourceBuffer=mediaSource.addSourceBuffer('video/webm; codecs="vp8"'),console.log("Source buffer: ",sourceBuffer)}function o(e){console.log("getUserMedia() got stream: ",e),window.stream=e,window.URL?s.src=window.URL.createObjectURL(e):s.src=e}function i(e){console.log("navigator.getUserMedia error: ",e)}window.addEventListener("load",function(){});var a=t("video");window.ws=a.wsFactory(),window.ws.binaryType="arraybuffer",ws.onopen=function(e){},ws.onclose=function(e){ws=a.wsFactory()},ws.onmessage=function(e){var t=new Blob([e.data],{type:"video/webm"});d.src=window.URL.createObjectURL(t),d.controls=!0},window.addEventListener("load",function(){var e=new MediaSource;e.addEventListener("sourceopen",r,!1)}),window.startRecording=function(){window.recordedBlobs=[];var e={mimeType:"video/webm;codecs=vp9"};MediaRecorder.isTypeSupported(e.mimeType)||(console.log(e.mimeType+" is not Supported"),e={mimeType:"video/webm;codecs=vp8"},MediaRecorder.isTypeSupported(e.mimeType)||(console.log(e.mimeType+" is not Supported"),e={mimeType:"video/webm"},MediaRecorder.isTypeSupported(e.mimeType)||(console.log(e.mimeType+" is not Supported"),e={mimeType:""})));try{window.mediaRecorder=new MediaRecorder(window.stream,e)}catch(t){return console.error("Exception while creating MediaRecorder: "+t),void console.error("Exception while creating MediaRecorder: "+t+". mimeType: "+e.mimeType)}console.log("Created MediaRecorder",mediaRecorder,"with options",e),mediaRecorder.onstop=handleStop,mediaRecorder.ondataavailable=handleDataAvailable,mediaRecorder.start(50),console.log("MediaRecorder started",mediaRecorder)},window.stopRecording=function(){window.mediaRecorder.stop(),console.log("Recorded Blobs: ",recordedBlobs),c.controls=!0},window.handleDataAvailable=function(e){e.data&&e.data.size>0&&recordedBlobs.push(e.data)},window.play=function(){var e=new Blob(recordedBlobs,{type:"video/webm"});c.src=window.URL.createObjectURL(e)},window.handleStop=function(e){console.log("Recorder stopped: ",e)};var s=document.querySelector("video#gum"),c=document.querySelector("video#recorded"),d=document.querySelector("video#remote"),u=document.querySelector("button#send");c.addEventListener("error",function(e){console.error("MediaRecording.recordedMedia.error()"),alert("Your browser can not play\n\n"+c.src+"\n\n media clip. event: "+JSON.stringify(e))},!0),window.mediaSource=new MediaSource,mediaSource.addEventListener("sourceopen",r,!1),window.mediaRecorder,window.recordedBlobs,window.sourceBuffer,window.stream;var l={audio:!1,video:!0};navigator.mediaDevices.getUserMedia(l).then(o)["catch"](i),u.onclick=function(e){startRecording(),setTimeout(function(){stopRecording(),play();var e=new Blob(recordedBlobs,{type:"video/webm"});ws.send(e)},1e3)}}),require.alias("brunch/node_modules/deppack/node_modules/node-browser-modules/node_modules/process/browser.js","process"),e=require("process"),require.register("___globals___",function(e,t,n){})}(),require("___globals___");