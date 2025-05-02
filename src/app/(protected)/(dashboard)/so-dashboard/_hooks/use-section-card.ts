'use client';

import { useOrderStaticsYearlyStore } from '@/hooks/use-order';
import { useStoreStaticsProduct } from '@/hooks/use-store';
import { useGetContractStore } from '@/hooks/use-user-store';
import dayjs from 'dayjs';

export const useSectionCardSoDashboard = () => {
  const currentYear = dayjs().year();
  const { staticsStore, isLoading: inventoriesByStoreLoading } =
    useStoreStaticsProduct();
  const { storeContract, isLoadingStoreContract } = useGetContractStore();
  const { orderStaticsYearlyStore, orderYearLoading } =
    useOrderStaticsYearlyStore(currentYear);

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
