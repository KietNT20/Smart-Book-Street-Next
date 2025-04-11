import { PATH } from '@/enums/path';
import { RoleEnums } from '@/enums/role';
import {
  clearUserProfile,
  hasUserRole,
  selectIsAuthenticated,
  selectProfile,
  setUserProfile,
} from '@/lib/features/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { userService } from '@/services/userService';
import { RegisterRequestBody } from '@/types/auth-types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export const useRegister = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: ['register'],
    mutationFn: (payload: RegisterRequestBody) => userService.register(payload),
    onSuccess: (data) => {
      if (!data?.isSuccess) {
        toast.error('Đăng ký thất bại');
        console.log('Error register', data);
      }
      if (data?.isSuccess) {
        toast.success('Đăng ký thành công');
        router.push(PATH.LOGIN);
      }
    },
    onError: (error: unknown) => {
      console.log('Error register', error);
      toast.error('Đăng ký thất bại');
    },
  });
};

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => userService.getProfile(),
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (response?.isSuccess && response.result) {
      dispatch(setUserProfile(response.result));
    }
  }, [response, dispatch]);

  useEffect(() => {
    if (isError && error) {
      console.error('Error fetching profile:', error);
      dispatch(clearUserProfile());
    }
  }, [isError, error, dispatch]);

  const hasRole = useCallback(
    (roles?: RoleEnums | RoleEnums[]): boolean => {
      return hasUserRole(profile, roles);
    },
    [profile]
  );

  return {
    user: profile,
    profile,
    isLoading,
    isAuthenticated,
    hasRole,
  };
};
