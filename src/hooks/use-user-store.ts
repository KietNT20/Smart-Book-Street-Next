import { userStoreService } from '@/services/userStoreService';
import { UserStorePayload } from '@/types/user-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUserStoresMutation = () => {
  const queryClient = useQueryClient();
  const registerStoreMutation = useMutation({
    mutationFn: (payload: UserStorePayload) =>
      userStoreService.registerUserStore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-stores'] });
      toast.success('Đăng ký thành công!');
    },
    onError: (error) => {
      console.log('Error registering store:', error);
      toast.error('Đăng ký không thành công!');
    },
  });

  return {
    registerStore: registerStoreMutation.mutate,
    isRegisteringStore: registerStoreMutation.isPending,
  };
};

export const useGetContractUser = (userId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['user-stores', userId],
    queryFn: () => userStoreService.checkUserContract(userId),
  });
  return {
    userStore: data,
    isLoadingUserStore: isLoading,
  };
};
