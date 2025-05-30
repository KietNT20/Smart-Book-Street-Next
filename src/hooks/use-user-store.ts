import { STORAGE } from '@/constant/storage';
import { PATH } from '@/enums/path';
import { userStoreService } from '@/services/userStoreService';
import { getLocalStorageItem } from '@/utils/token';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useUserStoresMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const registerStoreMutation = useMutation({
    mutationKey: ['rental-store'],
    mutationFn: (data: FormData) => userStoreService.registerUserStore(data),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['user-stores'] });
        queryClient.invalidateQueries({ queryKey: ['stores'] });
        toast.success('Đăng ký thành công!');
        router.replace(PATH.USER_STORES);
      }
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
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Chấm dứt hợp đồng thành công!');
      router.replace(PATH.USER_STORES);
    },
    onError: (error) => {
      console.log('Error deleting store:', error);
      toast.error('Chấm dứt hợp đồng không thành công!');
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
    queryKey: ['userstore-by-user', userId],
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
    queryKey: ['userstore-by-store', storeId],
    queryFn: () => userStoreService.checkStoreContract(storeId),
    enabled: !!storeId,
  });
  return {
    storeContract: data?.results || [],
    isLoadingStoreContract: isLoading,
    error,
  };
};

export const useUserStoreByStoreId = (storeId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-stores', storeId],
    queryFn: () => userStoreService.checkStoreContract(storeId),
    enabled: !!storeId,
  });
  return {
    userStoreByStore: data?.results || [],
    isLoadingUserStore: isLoading,
    error,
  };
};

export const useDownloadUserStoreContract = () => {
  const { mutate, isPending } = useMutation({
    mutationKey: ['download-user-store-contract'],
    mutationFn: ({ userId, storeId }: { userId: string; storeId: string }) =>
      userStoreService.downloadUserStoreContract(userId, storeId),
  });
  return {
    contractDownload: mutate,
    isPendingContract: isPending,
  };
};
