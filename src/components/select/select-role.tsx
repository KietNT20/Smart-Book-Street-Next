import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RoleLabels } from '@/enums/role';
import { useUserRoleMutation } from '@/hooks/use-user-roles';
import { UserRole } from '@/types/user-types';
import { useState } from 'react';
import { toast } from 'sonner';

type RoleOption = {
  value: string | undefined;
  label: string;
};

type UserRoleSelectorProps = {
  userId: string;
  currentRoleId?: UserRole[] | string | null;
  roles: RoleOption[];
  isLoading?: boolean;
};

export const UserRoleSelector = ({
  userId,
  currentRoleId,
  roles,
  isLoading = false,
}: UserRoleSelectorProps) => {
  const getCurrentRoleId = (): string => {
    if (!currentRoleId) return '';

    if (Array.isArray(currentRoleId)) {
      return currentRoleId.length > 0 ? currentRoleId[0].roleId : '';
    }

    return currentRoleId;
  };

  const [selectedRoleId, setSelectedRoleId] =
    useState<string>(getCurrentRoleId());

  const { authorizationRole } = useUserRoleMutation();

  const handleRoleChange = (value: string) => {
    if (value === selectedRoleId) return;

    setSelectedRoleId(value);

    authorizationRole(
      {
        roleId: value,
        userId: userId,
        assignedAt: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          toast.success('Phân quyền thành công!');
        },
      }
    );
  };

  const getCurrentRoleName = (): string => {
    const currentRole = roles.find((role) => role.value === selectedRoleId);
    return currentRole ? currentRole.label : 'Chọn vai trò';
  };

  return (
    <Select
      value={selectedRoleId || ''}
      onValueChange={handleRoleChange}
      disabled={isLoading}
    >
      <SelectTrigger className='h-8 w-32'>
        <SelectValue placeholder='Chọn vai trò'>
          {getCurrentRoleName()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role.value} value={role.value || ''}>
            {RoleLabels[role.label as keyof typeof RoleLabels]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
