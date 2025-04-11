import { userService } from '@/services/userService';
import { UserParams } from '@/types/user-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
