export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthError {
  httpStatus: number;
  httpStatusText: string;
  message: string;
  exception: string;
}

export interface AuthResponse {
  message: string;
  home_page: string;
  full_name: string;
}
