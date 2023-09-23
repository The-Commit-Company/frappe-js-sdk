export interface FileArgs<T> {
  /** If the file access is private then set to TRUE */
  isPrivate?: boolean;
  /** Folder the file exists in */
  folder?: string;
  /** File URL */
  file_url?: string;
  /** Doctype associated with the file */
  doctype?: string;
  /** Docname associated with the file */
  docname?: string;
  /** Field to be linked in the Document */
  fieldname?: string;
  /** Additional data to be sent along with the file */
  otherData?: T;
}
