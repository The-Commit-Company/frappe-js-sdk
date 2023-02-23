import { Error } from '../frappe_app/types';
import { getAxiosClient } from '../utils/axios';
import { AxiosInstance } from 'axios';
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

  /** Axios instance */
  private readonly axios: AxiosInstance;

  constructor(appURL: string, useToken?: boolean, token?: () => string, tokenType?: 'Bearer' | 'token') {
    this.appURL = appURL;
    this.useToken = useToken ?? false;
    this.token = token;
    this.tokenType = tokenType;
    this.axios = getAxiosClient(this.appURL, this.useToken, this.token, this.tokenType);
  }

  /** Logs in the user using username and password */
  async loginWithUsernamePassword(credentials: AuthCredentials): Promise<AuthResponse> {
    const { username, password, device } = credentials;

    return this.axios
      .post('/api/method/login', {
        usr: username,
        pwd: password,
        device,
      })
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
    return this.axios
      .get('/api/method/frappe.auth.get_logged_user')
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
    return this.axios
      .post('/api/method/logout', {})
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
    return this.axios
      .post('/', {
        cmd: 'frappe.core.doctype.user.user.reset_password',
        user,
      })
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
