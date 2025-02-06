import { PATH } from '@/enums/path';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/services/userService';
import { LoginCredentials, RegisterRequestBody } from '@/types/auth.types';
import { useMutation } from '@tanstack/react-query';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });
      return result;
    },
    onSuccess: (data) => {
      if (data?.status === 200 && data?.ok) {
        router.push(PATH.DASHBOARD);
        toast({
          title: 'Đăng nhập thành công',
          description: '',
          variant: 'success',
          duration: 3000,
        });
      }
    },
    onError: (error: any) => {
      console.log('Error login', error);
      toast({
        title: 'Error',
        description: 'Đăng nhập thất bại',
        variant: 'destructive',
      });
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => await signOut(),
  });
};

export const useRegister = () => {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ['register'],
    mutationFn: (payload: RegisterRequestBody) => userService.register(payload),
    onSuccess: (data) => {
      if (!data.isSuccess) {
        toast({
          title: 'Đăng ký thất bại',
          description: 'Tên tài khoản hoặc email đã tồn tại',
          variant: 'destructive',
        });
      }
      if (data.isSuccess) {
        toast({
          title: 'Đăng ký thành công',
          description: '',
          variant: 'success',
        });
        router.push(PATH.LOGIN);
      }
    },
    onError: (error) => {
      console.log('Error register', error);
      toast({
        title: 'Error',
        description: 'Đăng ký thất bại',
        variant: 'destructive',
      });
    },
  });
};
