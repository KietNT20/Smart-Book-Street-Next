import { PATH } from '@/enums/path';
import { RoleEnums } from '@/enums/role';
import { userService } from '@/services/userService';
import { RegisterRequestBody } from '@/types/auth-types';
import { User } from '@/types/user-types';
import tokenMethod from '@/utils/token';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
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
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: response, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => userService.getProfile(),
    staleTime: 0,
    refetchOnWindowFocus: false,
    enabled: !!tokenMethod.get()?.accessToken,
  });

  const hasRole = useCallback(
    (roles?: RoleEnums | RoleEnums[]): boolean => {
      return hasUserRole(response?.result, roles);
    },
    [response]
  );

  const handleLogout = () => {
    tokenMethod.remove();
    queryClient.clear();
    router.replace(PATH.LOGIN);
  };

  return {
    user: response?.result,
    profile: response?.result,
    isLoading,
    hasRole,
    handleLogout,
  };
};

export const hasUserRole = (
  profile?: User,
  roles?: RoleEnums | RoleEnums[]
): boolean => {
  // If no roles are provided, allow access
  if (!roles) return true;

  // If user is not authenticated, deny access
  if (!profile || !profile.userRoles || profile.userRoles.length === 0) {
    return false;
  }

  // Get the role names of the user
  const userRoleNames = profile.userRoles
    .filter((userRole) => userRole.role)
    .map((userRole) => userRole.role!.roleName);

  // Check if the user has any of the required roles
  if (Array.isArray(roles)) {
    return roles.some((role) => userRoleNames.includes(role));
  }

  return userRoleNames.includes(roles);
};
