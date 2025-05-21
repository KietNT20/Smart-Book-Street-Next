import { userRoleService } from '@/services/userRoleService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

  const { mutate: approveUserRole, isPending: isApprovingRole } = useMutation({
    mutationKey: ['user-role-approval'],
    mutationFn: ({
      userId,
      roleId,
      approved,
    }: {
      userId: string;
      roleId: string;
      approved: boolean;
    }) => userRoleService.approveUserRole(userId, roleId, approved),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['roles-at-pending'] });
        toast.success(`${data?.message}`);
      }
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
    approveUserRole,
    isApprovingRole,
  };
};

export const useRolePending = () => {
  const { data: rolesAtPending } = useQuery({
    queryKey: ['roles-at-pending'],
    queryFn: () => userRoleService.pendingRoles(),
  });

  return {
    rolesAtPending: rolesAtPending?.results || [],
    totalRecords: rolesAtPending?.totalRecords || 0,
  };
};
