import { AxiosInstance } from 'axios';
import { Error } from '../frappe_app/types';
import { getAxiosClient } from '../utils/axios';

export class FrappeCall {
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

  /** Makes a GET request to the specified endpoint */
  async get<T = any>(path: string, params?: Record<string, any>): Promise<T> {
    return this.axios
      .get(`/api/method/${path}`, { params })
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
    return this.axios
      .post(`/api/method/${path}`, { ...params })
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
    return this.axios
      .put(`/api/method/${path}`, { ...params })
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
    return this.axios
      .delete(`/api/method/${path}`, { params })
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
