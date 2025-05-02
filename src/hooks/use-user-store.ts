import { STORAGE } from '@/constant/storage';
import { PATH } from '@/enums/path';
import { userStoreService } from '@/services/userStoreService';
import { UserStorePayload } from '@/types/user-types';
import { getLocalStorageItem } from '@/utils/token';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useUserStoresMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const registerStoreMutation = useMutation({
    mutationKey: ['rent-store'],
    mutationFn: (payload: UserStorePayload) =>
      userStoreService.registerUserStore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-stores'] });
      toast.success('Đăng ký thành công!');
      router.replace(PATH.USER_STORES);
    },
    onError: (error) => {
      console.log('Error registering store:', error);
      toast.error('Đăng ký không thành công!');
    },
  });

  const deleteUserStoreMutation = useMutation({
    mutationKey: ['delete-user-store'],
    mutationFn: ({ userId, storeId }: { userId: string; storeId: string }) =>
      userStoreService.deleteUserStore(userId, storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-stores'] });
      toast.success('Xóa thành công!');
      router.replace(PATH.USER_STORES);
    },
    onError: (error) => {
      console.log('Error deleting store:', error);
      toast.error('Xóa không thành công!');
    },
  });

  return {
    registerStore: registerStoreMutation.mutate,
    isRegisteringStore: registerStoreMutation.isPending,
    deleteUserStore: deleteUserStoreMutation.mutate,
    isDeletingUserStore: deleteUserStoreMutation.isPending,
  };
};

export const useGetContractUser = (userId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-stores', userId],
    queryFn: () => userStoreService.checkUserContract(userId),
    enabled: !!userId,
  });
  return {
    userStore: data?.results || [],
    isLoadingUserStore: isLoading,
    error,
  };
};

export const useGetContractStore = () => {
  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);

  const { data, isLoading, error } = useQuery({
    queryKey: ['user-stores', storeId],
    queryFn: () => userStoreService.checkStoreContract(storeId),
    enabled: !!storeId,
  });
  return {
    storeContract: data?.results || [],
    isLoadingStoreContract: isLoading,
    error,
  };
};
