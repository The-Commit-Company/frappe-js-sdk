import axios, { AxiosRequestHeaders } from 'axios';
import { Filter, FrappeDoc, GetDocListArgs, GetLastDocArgs } from './types';
import { Error } from '../frappe_app/types';
export class FrappeDB {
  /** URL of the Frappe App instance */
  private readonly appURL: string;

  constructor(appURL: string) {
    this.appURL = appURL;
  }

  getRequestURL(doctype: string, docname?: string | null): string {
    let requestURL = `${this.appURL}/api/resource/`;
    if (docname) {
      requestURL += `${doctype}/${docname}`;
    } else {
      requestURL += `${doctype}`;
    }

    return requestURL;
  }

  /**
   * Get a document from the database
   * @param {string} doctype Name of the doctype
   * @param {string} docname Name of the document
   * @returns Promise which resolves to the document object
   */
  async getDoc<T>(doctype: string, docname?: string | null): Promise<FrappeDoc<T>> {
    const headers: AxiosRequestHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Frappe-Site-Name': window.location.hostname,
    };

    if ((window as any).csrf_token && (window as any).csrf_token !== '{{ csrf_token }}') {
      headers['X-Frappe-CSRF-Token'] = (window as any).csrf_token;
    }

    return axios
      .get(this.getRequestURL(doctype, docname), {
        headers,
        withCredentials: true,
      })
      .then((res) => res.data.data)
      .catch((error) => {
        throw {
          httpStatus: error.response.status,
          httpStatusText: error.response.statusText,
          message: 'There was an error while fetching the document.',
          exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
        } as Error;
      });
  }

  /**
   * Get a document from the database
   * @param {string} doctype Name of the doctype
   * @param {@type GetDocArgs} [args] Arguments for the query
   * @returns Promise which resolves to the document object
   */
  async getLastDoc<T>(doctype: string, args?: GetLastDocArgs): Promise<FrappeDoc<T>> {

    if (!args || !args?.orderBy) {
      args = {
        ...args,
        orderBy: {
          field: 'creation',
          order: 'desc'
        }
      }
    }

    const getDocLists = await this.getDocList<T & { name?: string }>(doctype, { ...args, limit: 1 });
    if (getDocLists.length > 0) {
      return this.getDoc<T>(doctype, getDocLists[0].name);
    }

    return {} as FrappeDoc<T>;
  };

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

    const headers: AxiosRequestHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Frappe-Site-Name': window.location.hostname,
    };

    if ((window as any).csrf_token && (window as any).csrf_token !== '{{ csrf_token }}') {
      headers['X-Frappe-CSRF-Token'] = (window as any).csrf_token;
    }

    return axios
      .get(this.getRequestURL(doctype), {
        params,
        headers,
        withCredentials: true,
      })
      .then((res) => res.data.data)
      .catch((error) => {
        throw {
          httpStatus: error.response.status,
          httpStatusText: error.response.statusText,
          message: 'There was an error while fetching the documents.',
          exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
        } as Error;
      });
  }

  /** Creates a new document in the database
   * @param {string} doctype Name of the doctype
   * @param {Object} value Contents of the document
   * @returns Promise which resolves with the complete document object
   */
  async createDoc<T>(doctype: string, value: T): Promise<FrappeDoc<T>> {
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
        this.getRequestURL(doctype),
        {
          ...value,
        },
        {
          headers,
          withCredentials: true,
        },
      )
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
  async updateDoc<T>(doctype: string, docname: string | null, value: Partial<T>): Promise<FrappeDoc<T>> {
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
        this.getRequestURL(doctype, docname),
        {
          ...value,
        },
        {
          headers,
          withCredentials: true,
        },
      )
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
  async deleteDoc(doctype: string, docname?: string | null): Promise<{ message: string }> {
    const headers: AxiosRequestHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Frappe-Site-Name': window.location.hostname,
    };

    if ((window as any).csrf_token && (window as any).csrf_token !== '{{ csrf_token }}') {
      headers['X-Frappe-CSRF-Token'] = (window as any).csrf_token;
    }

    return axios
      .delete(this.getRequestURL(doctype, docname), {
        headers,
        withCredentials: true,
      })
      .then((res) => res.data)
      .catch((error) => {
        throw {
          httpStatus: error.response.status,
          httpStatusText: error.response.statusText,
          message: 'There was an error while deleting the document.',
          exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
        } as Error;
      });
  }

  /**
   * Gets count of documents from the database for a particular doctype with the given filters
   * @param {string} doctype Name of the doctype
   * @param {@type Filter[]} [filters] Filters to be applied in the count query
   * @param {boolean} [cache] Whether to cache the result or not
   * @param {boolean} [debug] Whether to print debug messages or not
   * @returns Promise which resolves a number
   */
  async getCount(doctype: string, filters?: Filter[], cache: boolean = false, debug: boolean = false): Promise<number> {
    const params: any = {
      doctype,
      debug,
      cache,
      filters: []
    };

    if (filters) {
      params.filters = filters ? JSON.stringify(filters) : undefined
    }

    const headers: AxiosRequestHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Frappe-Site-Name': window.location.hostname,
    };

    if ((window as any).csrf_token && (window as any).csrf_token !== '{{ csrf_token }}') {
      headers['X-Frappe-CSRF-Token'] = (window as any).csrf_token;
    }

    return axios
      .get(`${this.appURL}/api/method/frappe.client.get_count`, {
        params,
        headers,
        withCredentials: true,
      })
      .then((res) => res.data.message)
      .catch((error) => {
        throw {
          httpStatus: error.response.status,
          httpStatusText: error.response.statusText,
          message: 'There was an error while getting the count.',
          exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
        } as Error;
      });
  }
}
