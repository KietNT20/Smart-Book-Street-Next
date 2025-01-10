export interface LoginResponse {
  result: {
    id: string;
    userName: string;
    email: string;
    fullName?: string;
    dob?: string;
    address?: string;
    phone?: string;
    gender?: string;
    userRoles?: string[];
  };
  token: string;
  expiration: number;
  isSuccess: boolean;
  message: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}
