import { FrappeAuth } from '..';
import { FrappeCall } from '../call';
import { FrappeDB } from '../db';
import { FrappeFileUpload } from '../file';

export class FrappeApp {
  /** URL of the Frappe instance */
  readonly url: string;

  /** Name of the Frappe App instance */
  readonly name: string;

  /** Whether to use the token from the window object */
  readonly useToken: boolean;

  /** Token to be used for authentication */
  readonly token?: () => string;

  /** Type of token to be used for authentication */
  readonly tokenType?: 'Bearer' | 'token'

  constructor(url: string, name?: string, useToken?: boolean, token?: () => string, tokenType: 'Bearer' | 'token' = 'Bearer') {
    this.url = url;
    this.name = name ?? 'FrappeApp';
    this.useToken = useToken ?? false;
    this.token = token;
    this.tokenType = tokenType;
  }

  /** Returns a FrappeAuth object for the app */
  auth() {
    return new FrappeAuth(this.url, this.useToken, this.token, this.tokenType);
  }
  /** Returns a FrappeDB object for the app */
  db() {
    return new FrappeDB(this.url, this.useToken, this.token, this.tokenType);
  }

  file() {
    return new FrappeFileUpload(this.url, this.useToken, this.token, this.tokenType);
  }

  call() {
    return new FrappeCall(this.url, this.useToken, this.token, this.tokenType);
  }
}
