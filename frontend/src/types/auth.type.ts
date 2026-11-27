export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface RegisterRequest {
  name: string;
  password: string;
  email: string;
}

export interface LoginRequest {
  password: string;
  email: string;
}

export interface AuthMessageResponse {
  message: string;
}

export interface RegisterResponse extends AuthMessageResponse {}
export interface MyProfileResponse {
  user: AuthUser;
}
