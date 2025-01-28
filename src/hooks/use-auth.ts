import { PATH } from '@/constant/path';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/services/userService';
import { LoginCredentials, RegisterRequestBody } from '@/types/auth.types';
import { useMutation } from '@tanstack/react-query';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useLogin() {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });
      if (!result?.ok) {
        throw new Error('Đăng nhập thất bại');
      }
      return result;
    },
    onSuccess: (data) => {
      if (data.status === 200 && data.ok) {
        toast({
          title: 'Success',
          description: 'Đăng nhập thành công',
          variant: 'success',
          duration: 3000,
        });
        router.refresh();
        router.push(PATH.DASHBOARD);
      }
    },
    onError: (error: any) => {
      console.log('Error login', error);
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => await signOut(),
  });
}

export function useRegister() {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (payload: RegisterRequestBody) =>
      await userService.register(payload),
    onSuccess: (data) => {
      if (data?.status === 200) {
        toast({
          title: 'Success',
          description: 'Đăng ký thành công',
          variant: 'success',
        });
        router.refresh();
        router.push(PATH.LOGIN);
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Đăng ký thất bại',
        variant: 'destructive',
      });
    },
  });
}
