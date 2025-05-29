import { useLogin } from '@/hooks/use-auth';
import { LoginFormValues, loginSchema } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
    login.mutate({ usernameOrEmail, password });
  };

  return {
    login,
    form,
    showPassword,
    setShowPassword,
    onSubmit,
  };
};
