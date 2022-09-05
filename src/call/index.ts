import axios, { AxiosRequestHeaders } from 'axios';
import { Error } from '../frappe_app/types';
export class FrappeCall {
    /** URL of the Frappe App instance */
    private readonly appURL: string;

    constructor(appURL: string) {
        this.appURL = appURL;
    }

    /** Makes a GET request to the specified endpoint */
    async get<T>(path: string, params?: Record<string, any>): Promise<T> {

        const headers: AxiosRequestHeaders = {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'X-Frappe-Site-Name': window.location.hostname,
        };

        if ((window as any).csrf_token && (window as any).csrf_token !== '{{ csrf_token }}') {
            headers['X-Frappe-CSRF-Token'] = (window as any).csrf_token;
        }

        return axios
            .get(
                `${this.appURL}/api/method/${path}`,
                {
                    headers,
                    params,
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

    /** Makes a POST request to the specified endpoint */
    async post<T>(path: string, params?: any): Promise<T> {

        const headers: AxiosRequestHeaders = {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'X-Frappe-Site-Name': window.location.hostname,
        };

        if ((window as any).csrf_token && (window as any).csrf_token !== '{{ csrf_token }}') {
            headers['X-Frappe-CSRF-Token'] = (window as any).csrf_token;
        }

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
    async put<T>(path: string, params?: any): Promise<T> {
        const headers: AxiosRequestHeaders = {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'X-Frappe-Site-Name': window.location.hostname,
        };

        if ((window as any).csrf_token && (window as any).csrf_token !== '{{ csrf_token }}') {
            headers['X-Frappe-CSRF-Token'] = (window as any).csrf_token;
        }
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
    async delete<T>(path: string, params?: any): Promise<T> {
        const headers: AxiosRequestHeaders = {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'X-Frappe-Site-Name': window.location.hostname,
        };

        if ((window as any).csrf_token && (window as any).csrf_token !== '{{ csrf_token }}') {
            headers['X-Frappe-CSRF-Token'] = (window as any).csrf_token;
        }
        return axios
            .delete(
                `${this.appURL}/api/method/${path}`,
                {
                    headers,
                    params,
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
}