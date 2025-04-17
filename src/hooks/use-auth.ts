import { PATH } from '@/enums/path';
import { RoleEnums } from '@/enums/role';
import {
  clearUserProfile,
  hasUserRole,
  setUserProfile,
} from '@/lib/features/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { userService } from '@/services/userService';
import { RegisterRequestBody } from '@/types/auth-types';
import tokenMethod from '@/utils/token';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
    onError: (error: Error) => {
      console.log('Error register', error);
      toast.error('Đăng ký thất bại');
    },
  });
};

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => userService.getProfile(),
    staleTime: 0,
    refetchOnWindowFocus: false,
    enabled: !!tokenMethod.get()?.accessToken,
  });

  if (response?.result) {
    dispatch(setUserProfile(response.result));
  }

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

  const handleLogout = () => {
    tokenMethod.remove();
    dispatch(clearUserProfile());
    queryClient.clear();
    router.push(PATH.LOGIN);
  };

  return {
    user: profile,
    profile,
    isLoading,
    isAuthenticated,
    hasRole,
    handleLogout,
  };
};
