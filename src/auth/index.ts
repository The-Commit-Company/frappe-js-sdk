import axios from 'axios';
import { AuthCredentials, AuthResponse, AuthError } from './types';

export class FrappeAuth {
  /** URL of the Frappe App instance */
  private readonly appURL: string;

  constructor(appURL: string) {
    this.appURL = appURL;
  }

  /** Logs in the user using username and password */
  async loginWithUsernamePassword(credentials: AuthCredentials): Promise<AuthResponse> {
    const { username, password } = credentials;
    return axios
      .post(
        `${this.appURL}/api/method/login`,
        {
          usr: username,
          pwd: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
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
        } as AuthError;
      });
  }

  /** Gets the currently logged in user */
  async getLoggedInUser(): Promise<string> {
    return axios
      .get(`${this.appURL}/api/method/frappe.auth.get_logged_user`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        withCredentials: true,
      })
      .then((res) => res.data.message)
      .catch((error) => {
        throw {
          httpStatus: error.response.status,
          httpStatusText: error.response.statusText,
          message: 'There was an error while fetching the logged in user',
          exception: error.response.data.exception ?? '',
        } as AuthError;
      });
  }
  /** Logs the user out */
  async logout(): Promise<void> {
    return axios
      .post(
        `${this.appURL}/api/method/logout`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
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
        } as AuthError;
      });
  }
}
