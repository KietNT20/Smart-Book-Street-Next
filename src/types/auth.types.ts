export interface UserRole {
  userId: string;
  roleId: string;
  id: string;
  createdBy?: string;
  createdDate?: string;
  lastUpdatedBy?: string;
  lastUpdatedDate?: string;
  isDeleted?: boolean;
}

export interface LoginResponse {
  result: {
    userName: string;
    email: string;
    fullName: string;
    gender: string;
    dob: string;
    address: string;
    phone: string;
    userRoles: UserRole[];
    id: string;
    createdBy?: string;
    createdDate?: string;
    lastUpdatedBy?: string;
    lastUpdatedDate?: string;
    isDeleted?: boolean;
  };
  token: string;
  expiration: string;
  isSuccess: boolean;
  message: string;
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface AuthError {
  type: 'CredentialsSignin' | 'NetworkError' | 'ServerError' | 'Default';
  message: string;
}
