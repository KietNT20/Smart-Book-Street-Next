import { RoleEnums } from '@/enums/role';
import { BaseEntity } from './common-types';
import { ImageType } from './image-types';
import { Publisher } from './publisher-types';

export interface Role extends BaseEntity {
  roleName:
    | RoleEnums.ADMIN
    | RoleEnums.PUBLISHER_MANAGER
    | RoleEnums.STORE_MANAGER;
  description: string;
}

export type UserRolePayload = {
  userId: string;
  roleId: string;
  assignedAt: string;
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
  dob: string;
  address: string;
  phone: string;
  gender: string;
  mainImageFile: string;
  additionalImageFiles: string[] | null;
  store: unknown;
  publisher: Publisher;
  userRoles: UserRole[];
  images: ImageType[];
}

export interface UserProfileResponse {
  result: User;
  isSuccess: boolean;
  message: string;
}
