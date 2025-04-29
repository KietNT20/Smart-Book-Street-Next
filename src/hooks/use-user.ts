import { PATH } from '@/enums/path';
import { userService } from '@/services/userService';
import { UserParams } from '@/types/user-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useUsersParams = ({
  sortField,
  sortOrder,
  result,
  pageSize,
  pageNumber,
}: UserParams) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', sortField, sortOrder, result, pageSize, pageNumber],
    queryFn: () =>
      userService.getUsersParams({
        sortField,
        sortOrder,
        result,
        pageSize,
        pageNumber,
      }),
  });

  const totalPage = data?.totalPages || 1;

  if (pageNumber < totalPage) {
    queryClient.prefetchQuery({
      queryKey: [
        'users',
        sortField,
        sortOrder,
        result,
        pageSize,
        pageNumber + 1,
      ],
      queryFn: () =>
        userService.getUsersParams({
          sortField,
          sortOrder,
          result,
          pageSize,
          pageNumber: pageNumber + 1,
        }),
    });
  }

  if (pageNumber > 1) {
    queryClient.prefetchQuery({
      queryKey: [
        'users',
        sortField,
        sortOrder,
        result,
        pageSize,
        pageNumber - 1,
      ],
      queryFn: () =>
        userService.getUsersParams({
          sortField,
          sortOrder,
          result,
          pageSize,
          pageNumber: pageNumber - 1,
        }),
    });
  }

  return {
    users: data?.results || [],
    usersLoading: isLoading,
    userError: error,
    totalPage,
  };
};

export const useUserEmail = (email: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['user-email', email],
    queryFn: () => userService.getByEmail(email),
    enabled: !!email,
  });

  if (data) {
    queryClient.setQueryData(['user-email', email], data);
  }

  return {
    user: data?.result || null,
    userLoading: isLoading,
    userError: error,
  };
};

export const useManagerEmail = (email: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['manager', email],
    queryFn: () => userService.getByEmail(email),
    enabled: !!email,
  });

  return {
    managerId: data?.result.id || null,
    managerLoading: isLoading,
    managerError: error,
  };
};

export const useUsers = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
  });

  return {
    users: data?.results || [],
    usersLoading: isLoading,
    userError: error,
  };
};

export const useUserMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createUserMutation = useMutation({
    mutationKey: ['create-user'],
    mutationFn: (formData: FormData) => userService.create(formData),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        toast.success('Tạo người dùng thành công!');
        router.replace(PATH.USERS);
      }
    },
    onError: (error) => {
      toast.error('Tạo người dùng thất bại!');
      console.error('Error creating user:', error);
    },
  });

  const updateUserMutation = useMutation({
    mutationKey: ['update-user'],
    mutationFn: (payload: { id: string; formData: FormData }) =>
      userService.update(payload.id, payload.formData),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        toast.success('Cập nhật người dùng thành công!');
      }
    },
    onError: (error) => {
      toast.error('Cập nhật người dùng thất bại!');
      console.error('Error updating user:', error);
    },
  });

  const deleteUserMutation = useMutation({
    mutationKey: ['delete-user'],
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        toast.success('Xóa người dùng thành công!');
      }
    },
    onError: (error) => {
      toast.error('Xóa người dùng thất bại!');
      console.error('Error deleting user:', error);
    },
  });

  return {
    createUser: createUserMutation.mutate,
    createUserPending: createUserMutation.isPending,
    updateUser: updateUserMutation.mutate,
    updateUserPending: updateUserMutation.isPending,
    deleteUser: deleteUserMutation.mutate,
    deleteUserPending: deleteUserMutation.isPending,
  };
};

export const useUserById = (userId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getById(userId),
    enabled: !!userId,
  });

  return {
    user: data?.result || null,
    userLoading: isLoading,
    userError: error,
  };
};
