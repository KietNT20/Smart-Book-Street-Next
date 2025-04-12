import { userRoleService } from '@/services/userRoleService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUserRoleMutation = () => {
  const queryClient = useQueryClient();

  const { mutate: addUserRole, isPending: isAddingRole } = useMutation({
    mutationKey: ['user-role-authorization'],
    mutationFn: (payload: {
      roleId: string;
      userId: string;
      assignedAt: string;
    }) => userRoleService.addUserRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Phân quyền thành công!');
    },
    onError: (error: Error) => {
      console.error('Error approving role:', error);
      toast.error('Có lỗi xảy ra trong quá trình phân quyền!');
    },
  });

  const { mutate: deleteUserRole, isPending: isDeletingRole } = useMutation({
    mutationKey: ['user-role-deletion'],
    mutationFn: (payload: { userId: string; roleId: string }) =>
      userRoleService.deleteUserRole(payload.userId, payload.roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Xóa quyền thành công!');
    },
    onError: (error: Error) => {
      console.error('Error deleting role:', error);
      toast.error('Có lỗi xảy ra trong quá trình xóa quyền!');
    },
  });

  return {
    addUserRole,
    isAddingRole,
    deleteUserRole,
    isDeletingRole,
  };
};
