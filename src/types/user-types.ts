import { RoleEnums } from '@/enums/role-enums';
import { BaseEntity } from './common-types';

export interface Role extends BaseEntity {
  roleName: RoleEnums;
  description: string;
}
