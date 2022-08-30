import axios, { AxiosRequestHeaders } from 'axios';
import { GetFileArgs } from './types';

export class FrappeFileUpload {
    /** URL of the Frappe App instance */
    private readonly appURL: string;

    constructor(appURL: string) {
        this.appURL = appURL;
    }

    /**
     * Upload file to database
     * @param {File} file to be uploaded
     * @param {@type GetFileArgs} args arguments of the file
     * @param {VoidFunction} onProgress file upload progress
     * @returns Promise which resolves with the file object
     */
    async uploadFile(file: File, args: GetFileArgs, onProgress?: (bytesUploaded: number, totalBytes: number) => void) {

        const formData = new FormData()
        if (file)
            formData.append('file', file, file.name)

        const { isPrivate, folder, file_url, doctype, docname } = args;

        if (isPrivate) {
            formData.append('is_private', 'TRUE');
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
        }

        const headers: AxiosRequestHeaders = {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'X-Frappe-Site-Name': window.location.hostname
        };

        if ((window as any).csrf_token && (window as any).csrf_token !== '{{ csrf_token }}') {
            headers['X-Frappe-CSRF-Token'] = (window as any).csrf_token;
        }

        return axios.post(`${this.appURL}/api/method/upload_file`,
            formData,
            {
                headers,
                onUploadProgress: (progressEvent) => {
                    if (onProgress) {
                        onProgress(progressEvent.loaded, progressEvent.total);
                    }
                },
            })
    };
}