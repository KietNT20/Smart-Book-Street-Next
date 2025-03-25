import { PATH } from '@/enums/path';
import { LoginFormValues, loginSchema } from '@/lib/zod';
import { LoginCredentials } from '@/types/auth-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AuthError } from 'next-auth';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

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
    mutationFn: async ({ usernameOrEmail, password }: LoginCredentials) => {
      try {
        const result = await signIn('credentials', {
          usernameOrEmail,
          password,
          redirect: false
        });
        return result;
      } catch (error) {
        if (error instanceof AuthError) {
          switch (error.type) {
            case 'CredentialsSignin':
              throw new Error('Tài khoản hoặc mật khẩu không chính xác');
            default:
              throw new Error('Đã xảy ra lỗi trong quá trình đăng nhập');
          }
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      if (!data?.error) {
        router.push(PATH.DASHBOARD);
        toast.success('Đăng nhập thành công', {
          id: 'login-success',
          description: 'Vui lòng chờ trong giây lát'
        });
        form.reset();
      } else if (data.error === 'Configuration') {
        form.setError('usernameOrEmail', {
          type: 'manual',
          message: 'Tài khoản hoặc mật khẩu không chính xác, Vui lòng thử lại'
        });
        form.setError('password', {
          type: 'manual',
          message: 'Tài khoản hoặc mật khẩu không chính xác, Vui lòng thử lại'
        });
      } else {
        console.log('Other Error', data.error);
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
