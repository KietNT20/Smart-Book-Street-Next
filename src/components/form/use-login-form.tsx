import { PATH } from '@/enums/path';
import { RoleEnums } from '@/enums/role';
import { LoginFormValues, loginSchema } from '@/lib/zod';
import { userService } from '@/services/userService';
import { LoginCredentials } from '@/types/auth-types';
import tokenMethod from '@/utils/token';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });

  const login = useMutation({
    mutationKey: ['login'],
    mutationFn: async ({ usernameOrEmail, password }: LoginCredentials) =>
      userService.login({ usernameOrEmail, password }),
    onSuccess: (data) => {
      if (data) {
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
          if (hasAdminRole) {
            router.push(PATH.DASHBOARD);
          } else if (hasPublisherManagerRole) {
            router.push(PATH.BOOKS);
          } else {
            router.push(PATH.STORE_OWNER_DASHBOARD);
          }
          toast.success('Đăng nhập thành công', {
            id: 'login-success',
            description: 'Vui lòng chờ trong giây lát',
          });
        }
        form.reset();
      }
    },
    onError: (error) => {
      console.log('Error logging in:', error);
      toast.error('Đăng nhập thất bại', {
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
      });
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    const { usernameOrEmail, password } = values;
    login.mutate({ usernameOrEmail, password });
  };

  useEffect(() => {
    const errorParam = searchParams.get('error');

    if (errorParam === 'unauthorized') {
      // Hiển thị toast thông báo lỗi
      toast.error('Bạn không có quyền đăng nhập', {
        description: 'Vui lòng liên hệ quản trị viên để được hỗ trợ',
        duration: 5000,
      });
    }
  }, [searchParams]);

  return {
    login,
    form,
    showPassword,
    setShowPassword,
    onSubmit,
  };
};
