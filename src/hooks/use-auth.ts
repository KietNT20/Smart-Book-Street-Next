import { PATH } from '@/enums/path';
import { userService } from '@/services/userService';
import { RegisterRequestBody } from '@/types/auth-types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
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
    }
  });
};
