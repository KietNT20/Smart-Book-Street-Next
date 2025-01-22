import { Gender } from '@/enums/gender-enums';

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
    id: string;
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

export interface RegisterRequestBody {
  userName: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  gender?: Gender;
}
