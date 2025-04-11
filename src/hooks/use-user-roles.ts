import { userRoleService } from '@/services/userRoleService';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUserRoleMutation = () => {
  const { mutate: authorizationRole, isPending: isApproving } = useMutation({
    mutationKey: ['user-role-authorization'],
    mutationFn: (payload: {
      roleId: string;
      userId: string;
      assignedAt: string;
    }) => userRoleService.approveRole(payload),
    onError: (error: Error) => {
      console.error('Error approving role:', error);
      toast.error('Có lỗi xảy ra trong quá trình phân quyền!');
    },
  });

  return {
    authorizationRole,
    isApproving,
  };
};
