import axios from 'axios';
import { FrappeApp } from '../frappe_app';
import { DBError, FrappeDoc, GetDocListArgs } from './types';

export class FrappeDB {
  /** URL of the Frappe App instance */
  private readonly appURL: string;

  constructor(app: FrappeApp) {
    this.appURL = app.url;
  }

  /**
   * Get a document from the database
   * @param {string} doctype Name of the doctype
   * @param {string} docname Name of the document
   * @returns Promise which resolves to the document object
   */
  async getDoc<T>(doctype: string, docname: string): Promise<T> {

    let headers: any = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Frappe-Site-Name': window.location.hostname
    };

    if ((window as any).csrf_token && (window as any).csrf_token !== '{{ csrf_token }}') {
      headers['X-Frappe-CSRF-Token'] = (window as any).csrf_token;
    }

    return axios.get(`${this.appURL}/api/resource/${doctype}/${docname}`,
      {
        headers: headers,
        withCredentials: true
      })
      .then((res) => res.data.data)
      .catch((error) => {
        throw {
          httpStatus: error.response.status,
          httpStatusText: error.response.statusText,
          message: 'There was an error while fetching the document.',
          exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
        } as DBError;
      });
  }


  /**
   * Gets a list of documents from the database for a particular doctype. Add filters, sorting order and pagination to get a filtered and sorted list of documents.
   * @param {string} doctype Name of the doctype
   * @param {@type GetDocListArgs} [args] Arguments for the query
   * @returns Promise which resolves to an array of documents
   */
  async getDocList<T>(doctype: string, args?: GetDocListArgs): Promise<T[]> {

    let params = {};

    if (args) {
      const { fields, filters, orFilters, orderBy, limit, limit_start, asDict = true } = args;
      const orderByString = orderBy ? `${orderBy?.field} ${orderBy?.order ?? 'asc'}` : '';
      params = {
        fields: fields ? JSON.stringify(fields) : undefined,
        filters: filters ? JSON.stringify(filters) : undefined,
        or_filters: orFilters ? JSON.stringify(orFilters) : undefined,
        order_by: orderByString,
        limit,
        page_limit_start: limit_start,
        as_dict: asDict,
      };
    }

    let headers: any = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Frappe-Site-Name': window.location.hostname
    };

    if ((window as any).csrf_token && (window as any).csrf_token !== '{{ csrf_token }}') {
      headers['X-Frappe-CSRF-Token'] = (window as any).csrf_token;
    }

    return axios.get(`${this.appURL}/api/resource/${doctype}`,
      {
        params,
        headers: headers,
        withCredentials: true
      })
      .then((res) => res.data.data)
      .catch((error) => {
        throw {
          httpStatus: error.response.status,
          httpStatusText: error.response.statusText,
          message: 'There was an error while fetching the documents.',
          exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
        } as DBError;
      });
  }


  /** Creates a new document in the database
   * @param {string} doctype Name of the doctype
   * @param {Object} value Contents of the document
   * @returns Promise which resolves with the complete document object
   */
  async createDoc<T>(doctype: string, value: T): Promise<FrappeDoc<T>> {

    let headers: any = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Frappe-Site-Name': window.location.hostname
    };

    if ((window as any).csrf_token && (window as any).csrf_token !== '{{ csrf_token }}') {
      headers['X-Frappe-CSRF-Token'] = (window as any).csrf_token;
    }

    return axios.post(`${this.appURL}/api/resource/${doctype}`,
      {
        ...value,
      },
      {
        headers: headers,
        withCredentials: true
      })
      .then((res) => res.data.data)
      .catch((error) => {
        throw {
          httpStatus: error.response.status,
          httpStatusText: error.response.statusText,
          message: error.response.data.message ?? 'There was an error while creating the document.',
          exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
        };
      });
  }


  /** Updates a document in the database
   * @param {string} doctype Name of the doctype
   * @param {string} docname Name of the document
   * @param {Object} value Contents of the document to update (only the fields that are to be updated)
   * @returns Promise which resolves with the complete document object
   */
  async updateDoc<T>(doctype: string, docname: string, value: Partial<T>): Promise<FrappeDoc<T>> {

    let headers: any = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Frappe-Site-Name': window.location.hostname
    };

    if ((window as any).csrf_token && (window as any).csrf_token !== '{{ csrf_token }}') {
      headers['X-Frappe-CSRF-Token'] = (window as any).csrf_token;
    }

    return axios.put(`${this.appURL}/api/resource/${doctype}/${docname}`,
      {
        ...value,
      },
      {
        headers: headers,
        withCredentials: true
      })
      .then((res) => res.data.data)
      .catch((error) => {
        throw {
          httpStatus: error.response.status,
          httpStatusText: error.response.statusText,
          message: error.response.data.message ?? 'There was an error while updating the document.',
          exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
        };
      });
  }


  /**
   * Deletes a document in the database
   * @param {string} doctype Name of the doctype
   * @param {string} docname Name of the document
   * @returns Promise which resolves an object with a message "ok"
   */
  async deleteDoc<T>(doctype: string, docname: string): Promise<{ message: string }> {

    let headers: any = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Frappe-Site-Name': window.location.hostname
    };

    if ((window as any).csrf_token && (window as any).csrf_token !== '{{ csrf_token }}') {
      headers['X-Frappe-CSRF-Token'] = (window as any).csrf_token;
    }

    return axios.delete(`${this.appURL}/api/resource/${doctype}/${docname}`,
      {
        headers: headers,
        withCredentials: true
      })
      .then((res) => res.data)
      .catch((error) => {
        throw {
          httpStatus: error.response.status,
          httpStatusText: error.response.statusText,
          message: 'There was an error while deleting the document.',
          exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
        } as DBError;
      });
  }
}