import { io, Socket } from "socket.io-client";
import { FrappeApp } from "../frappe_app";
export class FrappeRealtime {
    /** URL of the Frappe App instance */
    private readonly appURL: string;

    private readonly socketPort: string;

    public readonly socket: Socket;

    constructor(app: FrappeApp) {
        this.appURL = app.url;
        this.socketPort = app.socketPort;

        this.socket = this.initSocket();
    }

    initSocket() {
        return io(`https://${this.appURL}:${this.socketPort}`);
    }

    /**
     * 
     * @param event Name of the event
     * @param callback Callback to be executed when event is fired
     * @returns Unsubscribe function to switch off the event listener
     */
    listenEvent(event: string, callback: (data: any) => void) {
        this.socket.on(event, callback);

        return () => {
            this.socket.off(event, callback)
        }
    }
}