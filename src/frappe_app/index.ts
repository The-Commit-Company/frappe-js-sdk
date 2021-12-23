import { FrappeAuth } from "..";

export class FrappeApp {

    /** URL of the Frappe instance */
    readonly url: string;

    /** Name of the Frappe App instance */
    readonly name: string;

    constructor(url: string, name?: string) {
        this.url = url;
        this.name = name ?? 'FrappeApp';
    }

    /** Initializes a FrappeAuth object for the app */
    auth() {
        return new FrappeAuth(this.url)
    }
}