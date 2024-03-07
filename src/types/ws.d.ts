
export interface WsData {
  data: any;
}

export interface WsResponseMessage extends WsData {
  event: string;
  channel: string;
}
export interface WsBasicMessage extends WsData {
  type: "subscribe" | "unsubscribe" | "message";
}
export interface WsEventMessage extends WsData {
  event: string;
  channel: string;
}

export type WsRequestMessage = WsBasicMessage | WsEventMessage;

export interface WsClient {
  url: string;
  ws: WebSocket;
  channels: string[];
  payload: {
    appId: string;
  };
}
