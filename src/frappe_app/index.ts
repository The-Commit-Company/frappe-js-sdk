import { AxiosInstance } from 'axios';
import { FrappeAuth } from '..';
import { FrappeCall } from '../call';
import { FrappeDB } from '../db';
import { FrappeFileUpload } from '../file';
import { getAxiosClient } from '../utils/axios';
import { TokenParams } from './types';

export class FrappeApp {
  /** URL of the Frappe instance */
  readonly url: string;

  /** Name of the Frappe App instance */
  readonly name: string;

  /** Axios instance */
  readonly axios: AxiosInstance;

  /** Whether to use token based auth */
  readonly useToken: boolean;

  /** Function that returns the token to be used for authentication */
  readonly token?: () => string;

  /** Type of token to be used for authentication */
  readonly tokenType?: 'Bearer' | 'token';

  constructor(url: string, tokenParams: TokenParams, name?: string) {
    this.url = url;
    this.name = name ?? 'FrappeApp';
    this.useToken = tokenParams.useToken ?? false;
    this.token = tokenParams.token;
    this.tokenType = tokenParams.type ?? 'Bearer';
    this.axios = getAxiosClient(this.url, this.useToken, this.token, this.tokenType);
  }

  /** Returns a FrappeAuth object for the app */
  auth() {
    return new FrappeAuth(this.url, this.axios, this.useToken, this.token, this.tokenType);
  }

  /** Returns a FrappeDB object for the app */
  db() {
    return new FrappeDB(this.url, this.axios, this.useToken, this.token, this.tokenType);
  }

  /** Returns a FrappeFileUpload object for the app */
  file() {
    return new FrappeFileUpload(this.url, this.axios, this.useToken, this.token, this.tokenType);
  }

  /** Returns a FrappeCall object for the app */
  call() {
    return new FrappeCall(this.url, this.axios, this.useToken, this.token, this.tokenType);
  }
}
