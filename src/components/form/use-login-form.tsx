import { PATH } from '@/enums/path';
import { LoginFormValues, loginSchema } from '@/lib/zod';
import { userService } from '@/services/userService';
import { LoginCredentials } from '@/types/auth-types';
import tokenMethod from '@/utils/token';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: ''
    }
  });

  const login = useMutation({
    mutationKey: ['login'],
    mutationFn: async ({ usernameOrEmail, password }: LoginCredentials) =>
      userService.login({ usernameOrEmail, password }),
    onSuccess: (data) => {
      if (!data?.error) {
        if (data.token) {
          tokenMethod.set({
            accessToken: data.token,
            refreshToken: data.refreshToken
          });
        }
        router.push(PATH.DASHBOARD);
        toast.success('Đăng nhập thành công', {
          id: 'login-success',
          description: 'Vui lòng chờ trong giây lát'
        });
        form.reset();
      }
    },
    onError: (error) => {
      console.log('Error logging in:', error);
      toast.error('Đăng nhập thất bại', {
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau'
      });
    }
  });

  const onSubmit = (values: LoginFormValues) => {
    const { usernameOrEmail, password } = values;
    login.mutate({ usernameOrEmail, password });
  };

  return {
    login,
    form,
    showPassword,
    setShowPassword,
    onSubmit
  };
};
