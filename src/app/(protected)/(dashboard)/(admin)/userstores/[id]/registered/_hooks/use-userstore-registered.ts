import { StoreRent } from '@/enums/store-rent';
import {
  useGetContractUser,
  useUserStoresMutation,
} from '@/hooks/use-user-store';
import { formatDateVi } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  userId: string;
};

export const useUserStoreRegistered = ({ userId }: Props) => {
  const [selectedContractIndex, setSelectedContractIndex] = useState(0);
  const router = useRouter();
  const { userStore, isLoadingUserStore, error } = useGetContractUser(userId);
  const { deleteUserStore, isDeletingUserStore } = useUserStoresMutation();

  const isLoading = isLoadingUserStore || isDeletingUserStore;

  const handleDeleteUserStore = (userId: string, storeId: string) => {
    deleteUserStore({ userId, storeId });
  };

  const contract = userStore[selectedContractIndex];
  const store = contract?.store;
  const user = contract?.user;

  const startDate = formatDateVi(contract?.startDate);
  const endDate = formatDateVi(contract?.endDate);

  const getStatusColor = (status: StoreRent) => {
    switch (status) {
      case StoreRent.ACTIVE:
        return 'bg-green-100 text-green-800';
      case StoreRent.EXPIRED:
        return 'bg-red-100 text-red-800';
      case StoreRent.TERMINATED:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-zinc-800';
    }
  };

  return {
    userStore,
    isLoading,
    error,
    contract,
    store,
    user,
    startDate,
    endDate,
    getStatusColor,
    selectedContractIndex,
    setSelectedContractIndex,
    handleDeleteUserStore,
    isLoadingUserStore,
    isDeletingUserStore,
    router,
  };
};
