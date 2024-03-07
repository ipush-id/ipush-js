// src/index.ts
var Ipush = class {
  appId = "";
  ws;
  options;
  binds = {};
  subscribedTo = [];
  constructor(appId, options) {
    this.appId = appId;
    this.options = options;
    this.ws = new WebSocket(this.wsUrl());
    this.ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      this.onMessage(msg);
    };
  }
  wsUrl() {
    console.log(this.appId);
    const url = new URL(this.options.serverUrl);
    url.searchParams.append("appId", this.appId);
    return url;
  }
  onMessage(data) {
    this.binds[0](data);
    Object.keys(this.binds).filter((bind) => bind === data.event).forEach((bind) => this.binds[bind](data));
  }
  sendMessage(channel, event, data) {
    const msg = {
      type: "message",
      data,
      event,
      channel
    };
    this.ws.send(JSON.stringify(msg));
  }
  subscribe(channel) {
    this.subscribedTo.push(channel);
    const msg = {
      data: channel,
      type: "subscribe"
    };
    this.ws.send(JSON.stringify(msg));
  }
  unsubscribe(channel) {
    const index = this.subscribedTo.indexOf(channel);
    if (index < 0) {
      throw Error("Unsubscribe failed: invalid channel name");
    }
    this.subscribedTo.splice(index, 1);
    const msg = {
      data: channel,
      type: "unsubscribe"
    };
    this.ws.send(JSON.stringify(msg));
  }
  any(cb) {
    this.binds[0] = cb;
  }
  bind(event, cb) {
    this.binds[event] = cb;
  }
};
export {
  Ipush
};
