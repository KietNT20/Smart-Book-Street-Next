import { RoleEnums } from '@/enums/role-enums';
import { BaseEntity } from './common-types';

export interface Role extends BaseEntity {
  roleName: RoleEnums;
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
