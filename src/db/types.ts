type FilterOperator = '=' | '>' | '<' | '>=' | '<=' | '<>' | 'in' | 'not in' | 'like' | 'between' | '!=';
type Value = string | number | boolean | Date | null;
export type Filter<T = any> = [keyof T, FilterOperator, Value | Value[]];

export type FrappeDoc<T> = T & {
  /** User who created the document */
  owner: string;
  /** Date and time when the document was created - ISO format */
  creation: string;
  /** Date and time when the document was last modified - ISO format */
  modified: string;
  /** User who last modified the document */
  modified_by: string;
  idx: number;
  /** 0 - Saved, 1 - Submitted, 2 - Cancelled */
  docstatus: 0 | 1 | 2;
  parent?: any;
  parentfield?: any;
  parenttype?: any;
  /** The primary key of the DocType table */
  name: string;
};

export interface GetLastDocArgs<T = any> {
  filters?: Filter<FrappeDoc<T>>[];
  orFilters?: Filter<FrappeDoc<T>>[];
  orderBy?: {
    field: keyof FrappeDoc<T>;
    order?: 'asc' | 'desc';
  };
}

export interface GetDocListArgs<T = any> {
  /** Fields to be fetched */
  fields?: (keyof FrappeDoc<T>)[];
  /** Filters to be applied - SQL AND operation */
  filters?: Filter<FrappeDoc<T>>[];
  /** Filters to be applied - SQL OR operation */
  orFilters?: Filter<FrappeDoc<T>>[];
  /** Fetch from nth document in filtered and sorted list. Used for pagination  */
  limit_start?: number;
  /** Number of documents to be fetched. Default is 20  */
  limit?: number;
  /** Sort results by field and order  */
  orderBy?: {
    field: keyof FrappeDoc<T>;
    order?: 'asc' | 'desc';
  };
  /** Group the results by particular field */
  groupBy?: keyof FrappeDoc<T>;
  /** Fetch documents as a dictionary */
  asDict?: boolean;
}
