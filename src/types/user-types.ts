import { Sort } from '@/enums/enums';
import { Gender } from '@/enums/gender';
import { RoleEnums } from '@/enums/role';
import { StoreRent } from '@/enums/store-rent';
import { ApiListResponse, ApiResponseAll, BaseEntity } from './common-types';
import { ImageType } from './image-types';
import { Publisher } from './publisher-types';
import { StoreData } from './store-types';

export interface Role extends BaseEntity {
  roleName: RoleEnums;
  description: string;
}

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
  id: string;
  userId: string;
  roleId: string;
  assignedAt: string;
  isApproved: boolean;
  user: User | null;
  role: Role | null;
}

export type UserRoleAllResponse = ApiResponseAll<UserRole>;

export interface User extends BaseEntity {
  userName: string;
  password: string;
  email: string;
  fullName: string;
  dob: Date | string | null;
  address: string;
  phone: string;
  gender: Gender.Male | Gender.Female;
  mainImageFile: string | null;
  additionalImageFiles: string[] | null;
  publisher: Publisher;
  userRoles: UserRole[];
  userStores: UserStore[];
  images: ImageType[];
}

export interface UserProfileResponse {
  result: User & {
    id: string;
  };
  isSuccess: boolean;
  message: string;
}

export interface UsersResponse {
  results: Array<User & { id: string }>;
  totalPages: number;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}

export type UserResponseAll = ApiResponseAll<User & { id: string }>;

export interface UserParams {
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: Sort;
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

export interface UserStore extends BaseEntity {
  userId: string;
  user: User | null;
  storeId: string;
  store: StoreData | null;
  startDate: Date | string | null;
  endDate: Date | string | null;
  status: StoreRent;
  contractNumber: string;
  notes: string;
}

export type UserStoreResponse = ApiListResponse<UserStore & { id: string }>;
export type UserStoreResponseAll = ApiResponseAll<UserStore & { id: string }>;

export interface ChangePassPayload {
  usernameOrEmail: string;
  currentPassword: string;
  newPassword: string;
}
