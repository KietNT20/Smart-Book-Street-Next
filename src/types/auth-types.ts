import { Gender } from '@/enums/gender';
import { BaseEntity } from './common-types';
import { Role } from './user-types';

export interface UserRoles extends BaseEntity {
  userId?: string;
  roleId?: string;
  assignedAt?: string;
  role?: Role;
}

export type LoginResponse = {
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
};

export type LoginCredentials = {
  usernameOrEmail: string;
  password: string;
};

export type AuthError = {
  type: 'CredentialsSignin' | 'NetworkError' | 'ServerError' | 'Default';
  message: string;
};

export interface RegisterRequestBody extends Omit<BaseEntity, 'id'> {
  userName: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  gender?: Gender;
}

export type GoogleLoginResponse = {
  result: {
    userName: string;
    email: string;
    fullName: string;
    dob: string;
    address: string;
    phone: string;
    gender: string;
    bookStore: string;
    publisher: string;
    userRoles: UserRoles[];
    id: string;
    createdBy: string;
    createdDate: string;
    lastUpdatedBy: string;
    lastUpdatedDate: string;
    isDeleted: boolean;
  };
  token: string;
  expiration: string;
  isSuccess: boolean;
  message: string;
};
