import { Gender } from '@/enums/gender-enums';
import { BaseEntity } from './common-types';
import { Role } from './user-types';

export interface UserRoles extends BaseEntity {
  userId: string;
  roleId: string;
  assignedAt?: string;
  role: Role;
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
    userRoles: UserRoles[];
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

export interface RegisterRequestBody extends Omit<BaseEntity, 'id'> {
  userName: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  gender?: Gender;
}
