import axios, { AxiosRequestHeaders } from 'axios';
import { Error } from '../frappe_app/types';
import { getRequestHeaders } from '../utils';
export class FrappeCall {
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

  /** Makes a GET request to the specified endpoint */
  async get<T = any>(path: string, params?: Record<string, any>): Promise<T> {
    const headers = this.getPreparedRequestHeaders();

    return axios
      .get(`${this.appURL}/api/method/${path}`, {
        headers,
        params,
        withCredentials: true,
      })
      .then((res) => res.data as T)
      .catch((error) => {
        throw {
          httpStatus: error.response.status,
          httpStatusText: error.response.statusText,
          message: error.response.data.message ?? 'There was an error.',
          exception: error.response.data.exception ?? '',
        } as Error;
      });
  }

  /** Makes a POST request to the specified endpoint */
  async post<T = any>(path: string, params?: any): Promise<T> {
    const headers = this.getPreparedRequestHeaders();

    return axios
      .post(
        `${this.appURL}/api/method/${path}`,
        {
          ...params,
        },
        {
          withCredentials: true,
          headers,
        },
      )
      .then((res) => res.data as T)
      .catch((error) => {
        throw {
          httpStatus: error.response.status,
          httpStatusText: error.response.statusText,
          message: error.response.data.message ?? 'There was an error.',
          exception: error.response.data.exception ?? '',
        } as Error;
      });
  }

  /** Makes a PUT request to the specified endpoint */
  async put<T = any>(path: string, params?: any): Promise<T> {
    const headers = this.getPreparedRequestHeaders();

    return axios
      .put(
        `${this.appURL}/api/method/${path}`,
        {
          ...params,
        },
        {
          headers,
          withCredentials: true,
        },
      )
      .then((res) => res.data as T)
      .catch((error) => {
        throw {
          httpStatus: error.response.status,
          httpStatusText: error.response.statusText,
          message: error.response.data.message ?? 'There was an error.',
          exception: error.response.data.exception ?? '',
        } as Error;
      });
  }

  /** Makes a DELETE request to the specified endpoint */
  async delete<T = any>(path: string, params?: any): Promise<T> {
    const headers = this.getPreparedRequestHeaders();

    return axios
      .delete(`${this.appURL}/api/method/${path}`, {
        headers,
        params,
        withCredentials: true,
      })
      .then((res) => res.data as T)
      .catch((error) => {
        throw {
          httpStatus: error.response.status,
          httpStatusText: error.response.statusText,
          message: error.response.data.message ?? 'There was an error.',
          exception: error.response.data.exception ?? '',
        } as Error;
      });
  }
}
