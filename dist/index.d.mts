interface WsData {
  data: any;
}

interface WsResponseMessage extends WsData {
  event: string;
  channel: string;
}
interface WsBasicMessage extends WsData {
  type: "subscribe" | "unsubscribe" | "message";
}
interface WsEventMessage extends WsData {
  event: string;
  channel: string;
}

type WsRequestMessage = WsBasicMessage | WsEventMessage;

interface IpushOptions {
    serverUrl: string;
}

declare class Ipush {
    appId: string;
    ws: WebSocket;
    options: IpushOptions;
    binds: Record<string, (data: WsResponseMessage) => any>;
    subscribedTo: string[];
    constructor(appId: string, options: IpushOptions);
    wsUrl(): URL;
    private onMessage;
    sendMessage(channel: string, event: string, data: any): void;
    subscribe(channel: string): void;
    unsubscribe(channel: string): void;
    any(cb: (data: WsResponseMessage) => any): void;
    bind(event: string, cb: (data: WsResponseMessage) => any): void;
}

export { Ipush, type WsRequestMessage, type WsResponseMessage };
