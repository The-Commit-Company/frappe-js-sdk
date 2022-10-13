export interface FileArgs {
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
  /** Field in the document it is linked to */
  fieldname?: string;
}
