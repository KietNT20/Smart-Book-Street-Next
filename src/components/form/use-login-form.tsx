import { useLogin } from '@/hooks/use-auth';
import { LoginFormValues, loginSchema } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });

  const login = useLogin();

  const onSubmit = (values: LoginFormValues) => {
    const { usernameOrEmail, password } = values;
    login.mutate(
      { usernameOrEmail, password },
      {
        onSuccess: (data) => {
          if (data) {
            form.reset();
          }
        },
      }
    );
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
