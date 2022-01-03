import { FrappeAuth } from "..";
import { FrappeDB } from "../db";

export class FrappeApp {

    /** URL of the Frappe instance */
    readonly url: string;

    /** Name of the Frappe App instance */
    readonly name: string;

    constructor(url: string, name?: string) {
        this.url = url;
        this.name = name ?? 'FrappeApp';
    }

    /** Returns a FrappeAuth object for the app */
    auth() {
        return new FrappeAuth(this.url)
    }
    /** Returns a FrappeDB object for the app */
    db() {
        return new FrappeDB(this.url)
    }
}