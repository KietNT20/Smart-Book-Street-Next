import { useBreadcrumb } from '@/context/breadcrumb-context';
import { PATH } from '@/enums/path';
import { RoleEnums } from '@/enums/role';
import { userService } from '@/services/userService';
import { LoginCredentials, RegisterRequestBody } from '@/types/auth-types';
import { User } from '@/types/user-types';
import tokenMethod from '@/utils/token';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: ['login'],
    mutationFn: (payload: LoginCredentials) => userService.login(payload),
    onSuccess: (data) => {
      if (data.token) {
        tokenMethod.set({
          accessToken: data.token,
        });
      }
      if (data.result.userRoles) {
        const hasAdminRole = data.result.userRoles.some(
          (role) => role.role?.roleName === RoleEnums.ADMIN
        );
        const hasPublisherManagerRole = data.result.userRoles.some(
          (role) => role.role?.roleName === RoleEnums.PUBLISHER
        );
        const hasStaffRole = data.result.userRoles.some(
          (role) => role.role?.roleName === RoleEnums.STAFF
        );
        const hasStoreOwnerRole = data.result.userRoles.some(
          (role) => role.role?.roleName === RoleEnums.STORE_OWNER
        );
        const hasStoreManagerRole = data.result.userRoles.some(
          (role) => role.role?.roleName === RoleEnums.STORE_MANAGER
        );
        const hasOrganizerRole = data.result.userRoles.some(
          (role) => role.role?.roleName === RoleEnums.ORGANIZER
        );
        const hasNoRole = data.result.userRoles.length === 0;
        if (hasAdminRole) {
          router.replace(PATH.DASHBOARD);
        } else if (hasPublisherManagerRole) {
          router.replace(PATH.BOOKS);
        } else if (hasStaffRole) {
          router.replace(PATH.EVENT_DATE);
        } else if (hasOrganizerRole) {
          router.replace(PATH.EVENT_DATE);
        } else if (hasStoreOwnerRole) {
          router.replace(PATH.STORE_OWNER_DASHBOARD);
        } else if (hasStoreManagerRole) {
          router.replace(PATH.STORE_OWNER_DASHBOARD);
        }
        if (hasNoRole) {
          toast.error(
            'Tài khoản của bạn không có quyền truy cập vào hệ thống.'
          );
        } else {
          toast.success('Đăng nhập thành công', {
            id: 'login-success',
            description: 'Vui lòng chờ trong giây lát',
          });
        }
      }
    },
    onError: (error) => {
      console.log('Error login', error);
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        error.message ===
          'Bạn đang đăng nhập lần đầu bằng tài khoản do Admin cung cấp. Vui lòng đổi mật khẩu trước khi tiếp tục.'
      ) {
        toast.error(`Đăng nhập thất bại, ${(error as any).message}`);
        router.push(PATH.CHANGE_PASSWORD_FIRST_TIME);
      } else {
        toast.error(`Đăng nhập thất bại, ${error}`);
      }
    },
  });
};

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
    onError: (error) => {
      console.log('Error register', error);
      toast.error(`Đăng ký tài khoản thất bại, ${error.message}`);
    },
  });
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { clearLabels } = useBreadcrumb();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => userService.getProfile(),
    staleTime: 0,
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
    clearLabels();
    router.replace(PATH.LOGIN);
  };

  return {
    user: response?.result,
    profile: response?.result,
    isLoading,
    error,
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
