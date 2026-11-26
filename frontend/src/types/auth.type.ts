export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
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

export interface RegisterResponse extends AuthMessageResponse {
  token: string;
}
export interface MyProfileResponse {
  user: AuthUser;
}
