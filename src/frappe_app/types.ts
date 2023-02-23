export interface Error {
  httpStatus: number;
  httpStatusText: string;
  message: string;
  exception: string;
}

export interface TokenParams {
  /** Whether to use token for API calls */
  useToken: boolean;
  /** Function that returns the token as a string - this could be fetched from LocalStorage or auth providers like Firebase, Auth0 etc. */
  token?: () => string;
  /** Type of token to be used for authentication */
  type: 'Bearer' | 'token'
}
