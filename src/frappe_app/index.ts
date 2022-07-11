import { FrappeAuth } from '..';
import { FrappeDB } from '../db';
export class FrappeApp {
  /** URL of the Frappe instance */
  readonly url: string;

  /** Name of the Frappe App instance */
  readonly name: string;

  /** Port on which Socket IO is running. 
   * Default is 9000.
   */
  readonly socketPort: string;

  constructor(url: string, name?: string, socketPort?: string) {
    this.url = url;
    this.name = name ?? 'FrappeApp';
    this.socketPort = socketPort ?? '9000';
  }

  /** Returns a FrappeAuth object for the app */
  auth() {
    return new FrappeAuth(this.url);
  }
  /** Returns a FrappeDB object for the app */
  db() {
    return new FrappeDB(this.url);
  }
}
