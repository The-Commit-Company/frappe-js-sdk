import axios, { AxiosRequestHeaders } from 'axios';
import { Error } from '../frappe_app/types';
import { FileArgs } from './types';

export class FrappeFileUpload {
  /** URL of the Frappe App instance */
  private readonly appURL: string;

  /** Whether to use the token from the window object */
  readonly useToken: boolean;

  /** Token to be used for authentication */
  readonly token?: () => string;

  /** Type of token to be used for authentication */
  readonly tokenType?: 'Bearer' | 'token'

  constructor(appURL: string, useToken?: boolean, token?: () => string, tokenType?: 'Bearer' | 'token') {
    this.appURL = appURL;
    this.useToken = useToken ?? false;
    this.token = token;
    this.tokenType = tokenType;
  }

  /**
   * Upload file to database
   * @param {File} file to be uploaded
   * @param {@type FileArgs} args arguments of the file
   * @param {VoidFunction} onProgress file upload progress
   * @returns Promise which resolves with the file object
   */
  async uploadFile(file: File, args: FileArgs, onProgress?: (bytesUploaded: number, totalBytes: number) => void) {
    const formData = new FormData();
    if (file) formData.append('file', file, file.name);

    const { isPrivate, folder, file_url, doctype, docname, fieldname } = args;

    if (isPrivate) {
      formData.append('is_private', '1');
    }
    if (folder) {
      formData.append('folder', folder);
    }
    if (file_url) {
      formData.append('file_url', file_url);
    }
    if (doctype && docname) {
      formData.append('doctype', doctype);
      formData.append('docname', docname);
      if (fieldname) {
        formData.append('fieldname', fieldname);
      }
    }

    const headers: AxiosRequestHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Frappe-Site-Name': window.location.hostname,
    };

    if ((window as any).csrf_token && (window as any).csrf_token !== '{{ csrf_token }}') {
      headers['X-Frappe-CSRF-Token'] = (window as any).csrf_token;
    }

    if (this.useToken && this.tokenType != undefined && this.token != undefined) {
      headers['Authorization'] = `${this.tokenType} ${this.token()}`;
    }

    return axios
      .post(`${this.appURL}/api/method/upload_file`, formData, {
        headers,
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            onProgress(progressEvent.loaded, progressEvent.total);
          }
        },
      })
      .catch((error) => {
        throw {
          httpStatus: error.response.status,
          httpStatusText: error.response.statusText,
          message: error.response.data.message ?? 'There was an error while uploading the file.',
          exception: error.response.data.exception ?? '',
        } as Error;
      });
  }
}
