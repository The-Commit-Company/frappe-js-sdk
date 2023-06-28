type FilterOperator = '=' | '>' | '<' | '>=' | '<=' | '<>' | 'in' | 'not in' | 'like' | 'between' | '!=';
type Value = string | number | boolean | Date | null;
type MultiValueFilterOperator = 'in' | 'not in' | 'between';
type FilterVar<T> = keyof T | (string & Record<never, never>);
export type Filter<T = FrappeDoc<{}>> = [FilterVar<T>, FilterOperator, FilterOperator extends MultiValueFilterOperator ? Value[] : Value];

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
  filters?: Filter<T>[];
  orFilters?: Filter<T>[];
  orderBy?: {
    field: keyof T | (string & Record<never, never>);
    order?: 'asc' | 'desc';
  };
}

export interface GetDocListArgs<T = any> {
  /** Fields to be fetched */
  fields?: (keyof T)[];
  /** Filters to be applied - SQL AND operation */
  filters?: Filter<T>[];
  /** Filters to be applied - SQL OR operation */
  orFilters?: Filter<T>[];
  /** Fetch from nth document in filtered and sorted list. Used for pagination  */
  limit_start?: number;
  /** Number of documents to be fetched. Default is 20  */
  limit?: number;
  /** Sort results by field and order  */
  orderBy?: {
    field: keyof T | (string & Record<never, never>);
    order?: 'asc' | 'desc';
  };
  /** Group the results by particular field */
  groupBy?: keyof T | (string & Record<never, never>);
  /** Fetch documents as a dictionary */
  asDict?: boolean;
}
