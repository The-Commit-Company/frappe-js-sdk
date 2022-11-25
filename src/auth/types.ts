export interface AuthCredentials {
  username: string;
  password: string;
  device?: string;
}

export interface AuthResponse {
  message: string;
  home_page: string;
  full_name: string;
}
