'use client';

import { RoleEnums, RoleLabels } from '@/enums/role';
import { UserRole } from '@/types/user-types';
import { useMemo } from 'react';

type Props = {
  userRoles?: UserRole[];
  isApprovedOnly?: boolean;
};

const UserRoleDisplay = ({ userRoles, isApprovedOnly = false }: Props) => {
  const filteredRoles = useMemo(() => {
    if (!userRoles || userRoles.length === 0) return [];

    if (isApprovedOnly) {
      return userRoles.filter(
        (userRole) =>
          userRole &&
          userRole.role &&
          userRole.role.roleName &&
          userRole.isApproved &&
          (userRole.role.roleName === RoleEnums.STORE_OWNER ||
            userRole.role.roleName === RoleEnums.PUBLISHER)
      );
    }

    return userRoles.filter((userRole) => userRole && userRole.role);
  }, [userRoles, isApprovedOnly]);

  if (filteredRoles.length === 0) {
    return (
      <span className='font-medium'>
        {isApprovedOnly ? 'N/A' : 'Chưa có vai trò'}
      </span>
    );
  }

  return (
    <div className='space-y-2'>
      {filteredRoles.map((userRole, index) => {
        const roleId = userRole?.role?.id || `role-${index}`;
        const roleName = userRole?.role?.roleName;
        const roleLabel =
          roleName && typeof roleName === 'string'
            ? RoleLabels[roleName as RoleEnums] || 'Chưa cung cấp'
            : 'Chưa cung cấp';

        return (
          <div key={`${roleId}-${index}`} className='flex items-center gap-2'>
            <span className='font-medium'>{roleLabel}</span>
            <span
              className={`rounded-full px-2 py-1 text-xs ${
                isApprovedOnly || userRole?.isApproved
                  ? 'bg-matcha/10 text-matcha'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {isApprovedOnly || userRole?.isApproved
                ? 'Đã duyệt'
                : 'Chưa duyệt'}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default UserRoleDisplay;
