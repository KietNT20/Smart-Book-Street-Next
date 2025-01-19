import { PATH } from '@/constant/path';
import { useToast } from '@/hooks/use-toast';
import { AuthError, LoginCredentials } from '@/types/auth.types';
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

      if (result?.error) {
        const error: AuthError = {
          type: 'CredentialsSignin',
          message: 'Tài khoản hoặc mật khẩu không chính xác',
        };
        throw error;
      }
      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Đăng nhập thành công',
        variant: 'success',
      });
      router.push(PATH.DASHBOARD);
      router.refresh();
    },
    onError: (error: any) => {
      console.log('Error login', error);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ['logout'],
    mutationFn: () => signOut({ redirect: false }),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Đăng xuất thành công',
        variant: 'success',
      });
      router.push(PATH.LOGIN);
      router.refresh();
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Đăng ký thành công',
        variant: 'success',
      });
      router.push(PATH.DASHBOARD);
      router.refresh();
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
