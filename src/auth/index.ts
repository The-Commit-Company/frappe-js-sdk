import { Error } from '../frappe_app/types';
import { getRequestHeaders } from '../utils';
import axios, { AxiosRequestHeaders } from 'axios';
import { AuthCredentials, AuthResponse } from './types';

export class FrappeAuth {
  /** URL of the Frappe App instance */
  private readonly appURL: string;

  /** Whether to use the token based auth */
  readonly useToken: boolean;

  /** Token to be used for authentication */
  readonly token?: () => string;

  /** Type of token to be used for authentication */
  readonly tokenType?: 'Bearer' | 'token';

  constructor(appURL: string, useToken?: boolean, token?: () => string, tokenType?: 'Bearer' | 'token') {
    this.appURL = appURL;
    this.useToken = useToken ?? false;
    this.token = token;
    this.tokenType = tokenType;
  }

  private getPreparedRequestHeaders(): AxiosRequestHeaders {
    return getRequestHeaders(this.useToken, this.tokenType, this.token);
  }

  /** Logs in the user using username and password */
  async loginWithUsernamePassword(credentials: AuthCredentials): Promise<AuthResponse> {
    const { username, password, device } = credentials;

    const headers = this.getPreparedRequestHeaders();

    return axios
      .post(
        `${this.appURL}/api/method/login`,
        {
          usr: username,
          pwd: password,
          device,
        },
        {
          headers,
          withCredentials: true,
        },
      )
      .then((res) => res.data as AuthResponse)
      .catch((error) => {
        throw {
          httpStatus: error.response.status,
          httpStatusText: error.response.statusText,
          message: error.response.data.message ?? 'There was an error while logging in',
          exception: error.response.data.exception ?? '',
        } as Error;
      });
  }

  /** Gets the currently logged in user */
  async getLoggedInUser(): Promise<string> {
    const headers = this.getPreparedRequestHeaders();

    return axios
      .get(`${this.appURL}/api/method/frappe.auth.get_logged_user`, {
        headers,
        withCredentials: true,
      })
      .then((res) => res.data.message)
      .catch((error) => {
        throw {
          httpStatus: error.response.status,
          httpStatusText: error.response.statusText,
          message: 'There was an error while fetching the logged in user',
          exception: error.response.data.exception ?? '',
        } as Error;
      });
  }

  /** Logs the user out */
  async logout(): Promise<void> {
    const headers = this.getPreparedRequestHeaders();

    return axios
      .post(
        `${this.appURL}/api/method/logout`,
        {},
        {
          headers,
          withCredentials: true,
        },
      )
      .then(() => {
        return;
      })
      .catch((error) => {
        throw {
          httpStatus: error.response.status,
          httpStatusText: error.response.statusText,
          message: error.response.data.message ?? 'There was an error while logging out',
          exception: error.response.data.exception ?? '',
        } as Error;
      });
  }

  /** Sends password reset email */
  async forgetPassword(user: string): Promise<void> {
    const headers = this.getPreparedRequestHeaders();

    return axios
      .post(
        `${this.appURL}`,
        {
          cmd: 'frappe.core.doctype.user.user.reset_password',
          user,
        },
        {
          headers,
          withCredentials: true,
        },
      )
      .then(() => {
        return;
      })
      .catch((error) => {
        throw {
          httpStatus: error.response.status,
          httpStatusText: error.response.statusText,
          message: error.response.data.message ?? 'There was an error sending password reset email.',
          exception: error.response.data.exception ?? '',
        } as Error;
      });
  }
}
