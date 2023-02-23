import { AxiosInstance } from 'axios';

import { Error } from '../frappe_app/types';
import { Filter, FrappeDoc, GetDocListArgs, GetLastDocArgs } from './types';

export class FrappeDB {
  /** URL of the Frappe App instance */
  private readonly appURL: string;

  /** Axios instance */
  readonly axios: AxiosInstance;

  /** Whether to use the token based auth */
  readonly useToken: boolean;

  /** Token to be used for authentication */
  readonly token?: () => string;

  /** Type of token to be used for authentication */
  readonly tokenType?: 'Bearer' | 'token';

  constructor(
    appURL: string,
    axios: AxiosInstance,
    useToken?: boolean,
    token?: () => string,
    tokenType?: 'Bearer' | 'token',
  ) {
    this.appURL = appURL;
    this.axios = axios;
    this.useToken = useToken ?? false;
    this.token = token;
    this.tokenType = tokenType;
  }

  /**
   * Get a document from the database
   * @param {string} doctype Name of the doctype
   * @param {string} docname Name of the document
   * @returns Promise which resolves to the document object
   */
  async getDoc<T = any>(doctype: string, docname?: string | null): Promise<FrappeDoc<T>> {
    return this.axios
      .get(`/api/resource/${doctype}/${docname}`)
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
   * Gets a list of documents from the database for a particular doctype. Add filters, sorting order and pagination to get a filtered and sorted list of documents.
   * @param {string} doctype Name of the doctype
   * @param {@type GetDocListArgs} [args] Arguments for the query
   * @returns Promise which resolves to an array of documents
   */
  async getDocList<T = any>(doctype: string, args?: GetDocListArgs): Promise<T[]> {
    let params = {};

    if (args) {
      const { fields, filters, orFilters, orderBy, limit, limit_start, groupBy, asDict = true } = args;
      const orderByString = orderBy ? `${orderBy?.field} ${orderBy?.order ?? 'asc'}` : '';
      params = {
        fields: fields ? JSON.stringify(fields) : undefined,
        filters: filters ? JSON.stringify(filters) : undefined,
        or_filters: orFilters ? JSON.stringify(orFilters) : undefined,
        order_by: orderByString,
        group_by: groupBy,
        limit,
        limit_start,
        as_dict: asDict,
      };
    }

    return this.axios
      .get(`/api/resource/${doctype}`, { params })
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
  async createDoc<T = any>(doctype: string, value: T): Promise<FrappeDoc<T>> {
    return this.axios
      .post(`/api/resource/${doctype}`, { ...value })
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
  async updateDoc<T = any>(doctype: string, docname: string | null, value: Partial<T>): Promise<FrappeDoc<T>> {
    return this.axios
      .put(`/api/resource/${doctype}/${docname}`, { ...value })
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
    return this.axios
      .delete(`/api/resource/${doctype}/${docname}`)
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
      filters: [],
    };

    if (cache) {
      params.cache = cache;
    }

    if (debug) {
      params.debug = debug;
    }
    if (filters) {
      params.filters = filters ? JSON.stringify(filters) : undefined;
    }

    return this.axios
      .get('/api/method/frappe.client.get_count', { params })
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
  /**
   * Get a document from the database
   * @param {string} doctype Name of the doctype
   * @param {@type GetLastDocArgs} [args] Arguments for the query
   * @returns Promise which resolves to the document object
   */
  async getLastDoc<T = any>(doctype: string, args?: GetLastDocArgs): Promise<FrappeDoc<T>> {
    let queryArgs: GetLastDocArgs = {
      orderBy: {
        field: 'creation',
        order: 'desc',
      },
    };
    if (args) {
      queryArgs = {
        ...queryArgs,
        ...args,
      };
    }

    const getDocLists = await this.getDocList<{ name?: string }>(doctype, { ...queryArgs, limit: 1 });
    if (getDocLists.length > 0) {
      return this.getDoc<T>(doctype, getDocLists[0].name);
    }

    return {} as FrappeDoc<T>;
  }
}
