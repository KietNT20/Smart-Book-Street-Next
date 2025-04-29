import { STORAGE } from '@/constant/storage';
import { useStoreStaticsProduct } from '@/hooks/use-store';
import { getLocalStorageItem } from '@/utils/token';

export const useSectionCardSoDashboard = () => {
  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);
  const { staticsStore, isLoading: inventoriesByStoreLoading } =
    useStoreStaticsProduct(storeId);

  return {
    staticsStore,
    inventoriesByStoreLoading,
  };
};
