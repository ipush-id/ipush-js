import type { WsBasicMessage, WsRequestMessage, WsResponseMessage } from './types/ws'
interface IpushOptions {
    serverUrl: string
}
export type { WsRequestMessage, WsResponseMessage } from './types/ws'
export class Ipush {
    appId: string = ""
    ws: WebSocket
    options: IpushOptions
    binds: Record<string, (data: WsResponseMessage) => any> = {}
    subscribedTo: string[] = []

    constructor(appId: string, options: IpushOptions) {
        this.appId = appId
        this.options = options
        this.ws = new WebSocket(this.wsUrl())

        this.ws.onmessage = (ev) => {
            const msg: WsResponseMessage = JSON.parse(ev.data)
            this.onMessage(msg)
        }
    }

    wsUrl() {
        console.log(this.appId)
        const url = new URL(this.options.serverUrl)
        url.searchParams.append("appId", this.appId)
        return url
    }

    private onMessage(data: WsResponseMessage) {
        this.binds[0](data)
        // Trigger the callback
        Object.keys(this.binds)
            .filter(bind => bind === data.event)
            .forEach(bind => this.binds[bind](data))
    }

    sendMessage(channel: string, event: string, data: any) {
        const msg = {
            type: 'message',
            data,
            event,
            channel 
        }
        this.ws.send(JSON.stringify(msg))
    }

    
    subscribe(channel: string) {
        this.subscribedTo.push(channel)
        const msg = {
            data: channel,
            type: 'subscribe'
        }
        this.ws.send(JSON.stringify(msg))
    }
    
    unsubscribe(channel: string) {
        const index = this.subscribedTo.indexOf(channel)
        if(index < 0) {
            throw Error("Unsubscribe failed: invalid channel name")
        }
        this.subscribedTo.splice(index, 1)
        const msg = {
            data: channel,
            type: 'unsubscribe'
        }
        this.ws.send(JSON.stringify(msg))
    }

    any(cb: (data: WsResponseMessage) => any) {
        this.binds[0] = cb
    }

    bind(event: string, cb: (data: WsResponseMessage) => any) {
        this.binds[event] = cb
    }
}