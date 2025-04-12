import { Sort } from '@/enums/enums';
import { Gender } from '@/enums/gender';
import { RoleEnums } from '@/enums/role';
import { StoreRent } from '@/enums/store-rent';
import { BaseEntity } from './common-types';
import { ImageType } from './image-types';
import { Publisher } from './publisher-types';

export interface Role extends BaseEntity {
  roleName: RoleEnums;
  description: string;
}

export type RolesResponse = {
  results: Role[];
  totalRecords: number;
  isSuccess: true;
  message: string;
};

export type UserRolePayload = {
  userId: string;
  roleId: string;
  assignedAt: string;
};

export type UserStorePayload = {
  userId: string;
  storeId: string;
  startDate: string;
  endDate: string;
  status: StoreRent;
  contractNumber: string;
  notes?: string;
};

export type RolePayload = {
  roleName: RoleEnums;
  description: string;
};

export interface UserRole extends BaseEntity {
  userId: string;
  roleId: string;
  assignedAt: string;
  user: User | null;
  role: Role | null;
}

export interface User extends BaseEntity {
  userName: string;
  password: string;
  email: string;
  fullName: string;
  dob: string | null;
  address: string;
  phone: string;
  gender: Gender.Male | Gender.Female;
  mainImageFile: string | null;
  additionalImageFiles: string[] | null;
  publisher: Publisher;
  userRoles: UserRole[];
  userStores: any[];
  images: ImageType[];
}

export interface UserProfileResponse {
  result: User;
  isSuccess: boolean;
  message: string;
}

export interface UsersResponse {
  results: User[];
  totalPages: number;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}

export interface UserParams {
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: Sort.ASC | Sort.DESC;
  result: {
    userName?: string;
    email?: string;
    fullName?: string;
    dob?: string;
    address?: string;
    phone?: string;
    gender?: string;
  };
}
