    var onopen = (evt) => {
      let msg = `connection opened: ${evt.target.url}}`;
      let ws = evt.target;
      // ws.send(JSON.stringify({}));
      console.info(msg);
    };

    var onclose = (evt) => {
      let msg = `connection closed: ${evt.target.url}}`;
      console.warn(msg);
    };

    var onmessage = (evt) => {
      let data = JSON.parse(evt.data);
      // data.date = new Date(data.date);
      console.table([data]);
    };

    var onerror = (evt) => {
      let data = evt.data;
      console.warn(data);
    };

    module.exports = {
      onopen: onopen,
      onclose: onclose,
      onmessage: onmessage,
      onerror: onerror,
    };