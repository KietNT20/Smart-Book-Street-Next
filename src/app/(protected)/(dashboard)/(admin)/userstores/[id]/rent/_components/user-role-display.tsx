import { RoleEnums, RoleLabels } from '@/enums/role';
import { UserRole } from '@/types/user-types';

type Props = {
  userRoles: UserRole[];
  isApprovedOnly?: boolean;
};

const UserRoleDisplay = ({ userRoles, isApprovedOnly = false }: Props) => {
  if (!userRoles || !Array.isArray(userRoles) || userRoles.length === 0) {
    return (
      <span className='font-medium'>
        {isApprovedOnly ? 'N/A' : 'Chưa có vai trò'}
      </span>
    );
  }

  const filteredRoles = isApprovedOnly
    ? userRoles.filter(
        (userRole) =>
          userRole &&
          userRole.role &&
          userRole.role.roleName &&
          userRole.isApproved &&
          (userRole.role.roleName === RoleEnums.STORE_OWNER ||
            userRole.role.roleName === RoleEnums.PUBLISHER)
      )
    : userRoles.filter((userRole) => userRole && userRole.role);

  if (filteredRoles.length === 0) {
    return (
      <span className='font-medium'>
        {isApprovedOnly ? 'N/A' : 'Chưa có vai trò'}
      </span>
    );
  }

  return (
    <>
      {filteredRoles.map((userRole, index) => {
        const roleKey = `${isApprovedOnly ? 'approved-' : ''}role-${index}-${userRole?.role?.roleName || 'unknown'}`;
        const roleName = userRole?.role?.roleName;
        const roleLabel =
          roleName && typeof roleName === 'string'
            ? RoleLabels[roleName as RoleEnums] ||
              (isApprovedOnly ? 'N/A' : 'Chưa cung cấp')
            : isApprovedOnly
              ? 'N/A'
              : 'Chưa cung cấp';

        return (
          <div key={roleKey} className='flex items-center gap-2'>
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
    </>
  );
};

export default UserRoleDisplay;
