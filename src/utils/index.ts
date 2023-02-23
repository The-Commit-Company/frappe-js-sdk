import { AxiosRequestHeaders } from 'axios';

export function getRequestHeaders(
  useToken: boolean = false,
  tokenType?: 'Bearer' | 'token',
  token?: () => string,
): AxiosRequestHeaders {
  const headers: AxiosRequestHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  };

  if (useToken && tokenType && token) {
    headers.Authorization = `${tokenType} ${token()}`;
  }

  // in case of browser environments
  if (typeof window !== 'undefined') {
    headers['X-Frappe-Site-Name'] = window.location.hostname;
    if ((window as any).csrf_token && (window as any).csrf_token !== '{{ csrf_token }}') {
      headers['X-Frappe-CSRF-Token'] = (window as any).csrf_token;
    }
  }

  return headers;
}
