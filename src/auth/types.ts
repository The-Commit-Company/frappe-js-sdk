export interface AuthCredentials {
  username?: string;
  password?: string;
  otp?: string;
  tmp_id?: string;
  device?: string;
}

export interface AuthResponse {
  message: string;
  home_page: string;
  full_name: string;
  tmp_id: string;
  verification: any;
}
