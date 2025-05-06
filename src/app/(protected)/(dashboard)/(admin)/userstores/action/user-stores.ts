import { userService } from '@/services/userService';
import { userStoreService } from '@/services/userStoreService';
import { ApiResponseAll } from '@/types/common-types';
import { User } from '@/types/user-types';
import { useQuery } from '@tanstack/react-query';

export type UserRentals = User & {
  hasRental: boolean;
  contractNumber?: string;
};

export type UserWithRentalStatus = ApiResponseAll<UserRentals>;

export async function getListUserRentals(): Promise<UserWithRentalStatus> {
  try {
    const usersResponse = await userService.getAll();
    const users = usersResponse.results;

    const userStoresResponse = await userStoreService.getUserStores();
    const userStores = userStoresResponse.results;

    const usersWithRentalStatus = users.map((user) => {
      const hasRental = userStores.some(
        (userStore) => userStore.userId === user.id
      );

      return {
        ...user,
        contractNumber:
          userStores.find((userStore) => userStore.userId === user.id)
            ?.contractNumber || undefined,
        hasRental,
      };
    });

    return {
      results: usersWithRentalStatus,
      totalRecords: usersWithRentalStatus.length,
      isSuccess: true,
      message: 'Successfully retrieved users with rental status',
    };
  } catch (error) {
    console.error('Error fetching user rental data:', error);
    return {
      isSuccess: false,
      message: 'Failed to fetch user rental data',
      results: [],
      totalRecords: 0,
    };
  }
}

export const useListUserRentals = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-rentals'],
    queryFn: getListUserRentals,
  });

  return {
    userRentals: data?.results || [],
    isLoadingUserRentals: isLoading,
    error,
  };
};
