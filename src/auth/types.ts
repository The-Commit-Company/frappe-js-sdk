export type AuthCredentials = UserPassCredentials | OTPCredentials;

export interface AuthResponse {
  message?: string;
  home_page?: string;
  full_name?: string;
  tmp_id?: string;
  verification?: any;
  exc_type?: string;
}

export interface UserPassCredentials {
  username: string;
  password: string;
  device?: string;
}

export interface OTPCredentials {
  otp: string;
  tmp_id: string;
  device?: string;
}