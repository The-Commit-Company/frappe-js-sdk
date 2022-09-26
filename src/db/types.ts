type FilterOperator = '=' | '>' | '<' | '>=' | '<=' | '<>' | 'in' | 'like' | 'between';
type Value = string | number | boolean | Date | null;
export type Filter = [string, FilterOperator, Value | Value[]];

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

export interface GetLastDocArgs {
  filters?: Filter[];
  orFilters?: Filter[];
  orderBy?: {
    field: string;
    order?: 'asc' | 'desc';
  };
}
export interface GetDocListArgs {
  /** Fields to be fetched */
  fields?: string[];
  /** Filters to be applied - SQL AND operation */
  filters?: Filter[];
  /** Filters to be applied - SQL OR operation */
  orFilters?: Filter[];
  /** Fetch from nth document in filtered and sorted list. Used for pagination  */
  limit_start?: number;
  /** Number of documents to be fetched. Default is 20  */
  limit?: number;
  /** Sort results by field and order  */
  orderBy?: {
    field: string;
    order?: 'asc' | 'desc';
  };
  /** Fetch documents as a dictionary */
  asDict?: boolean;
}
