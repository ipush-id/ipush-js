var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Ipush: () => Ipush
});
module.exports = __toCommonJS(src_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Ipush
});
