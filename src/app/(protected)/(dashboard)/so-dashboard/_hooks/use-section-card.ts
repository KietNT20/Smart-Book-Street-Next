import { STORAGE } from '@/constant/storage';
import { useOrderStaticsYearlyStore } from '@/hooks/use-order';
import { useStoreStaticsProduct } from '@/hooks/use-store';
import { useGetContractStore } from '@/hooks/use-user-store';
import { getLocalStorageItem } from '@/utils/token';
import dayjs from 'dayjs';

export const useSectionCardSoDashboard = () => {
  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);
  const currentYear = dayjs().year();
  const { staticsStore, isLoading: inventoriesByStoreLoading } =
    useStoreStaticsProduct(storeId);
  const { storeContract, isLoadingStoreContract } =
    useGetContractStore(storeId);
  const { orderStaticsYearlyStore, orderYearLoading } =
    useOrderStaticsYearlyStore(currentYear, storeId);

  return {
    staticsStore,
    inventoriesByStoreLoading,
    storeContract,
    isLoadingStoreContract,
    orderStaticsYearlyStore,
    orderYearLoading,
    currentYear,
  };
};
