export interface Role {
  id: string;
  roleName: string;
  description: string;
  userRoles?: [];
  createdBy?: string;
  createdDate?: string;
  lastUpdatedBy?: string;
  lastUpdatedDate?: string;
  isDeleted?: boolean;
}
