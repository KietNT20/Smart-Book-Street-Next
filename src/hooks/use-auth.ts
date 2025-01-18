import { auth } from '@/auth';
import { PATH } from '@/constant/path';
import { useToast } from '@/hooks/use-toast';
import { LoginCredentials } from '@/types/auth.types';
import axiosInstance from '@/utils/axiosInstance';
import { useMutation, useQuery } from '@tanstack/react-query';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useLogin() {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
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
        description: 'Đăng nhập thành công',
      });
      router.push(PATH.DASHBOARD);
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Đăng nhập thất bại',
        variant: 'destructive',
      });
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => signOut({ redirect: false }),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Đăng xuất thành công',
      });
      router.push(PATH.LOGIN);
      router.refresh();
    },
  });
}

// Hook để fetch user profile
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => axiosInstance.get('/users/me').then((res) => res.data),
    // Chỉ fetch khi có session
    enabled: !!auth(),
  });
}
