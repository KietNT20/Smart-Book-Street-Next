export enum RoleEnums {
  ADMIN = 'Admin',
  PUBLISHER = 'Publisher',
  STORE_MANAGER = 'StoreManager',
  STORE_OWNER = 'StoreOwner',
  STAFF = 'Staff',
}

export const RoleLabels: Record<RoleEnums, string> = {
  [RoleEnums.ADMIN]: 'Quản trị viên',
  [RoleEnums.PUBLISHER]: 'Nhà xuất bản',
  [RoleEnums.STORE_MANAGER]: 'Quản lý cửa hàng',
  [RoleEnums.STORE_OWNER]: 'Chủ cửa hàng',
  [RoleEnums.STAFF]: 'Nhân viên',
};
