'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { PATH } from '@/enums/path';
import { cn } from '@/lib/utils';
import { LoginFormValues, loginSchema } from '@/lib/zod';
import { LoginCredentials } from '@/types/auth-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import GoogleButton from './google-button/google-button';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form';
import { Input } from './ui/input';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
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
    mutationFn: ({ usernameOrEmail, password }: LoginCredentials) =>
      signIn('credentials', {
        usernameOrEmail,
        password,
        redirect: false
      }),
    onSuccess: (data) => {
      if (data?.error === 'Configuration') {
        form.setError('usernameOrEmail', {
          type: 'manual',
          message: 'Tài khoản hoặc mật khẩu không chính xác'
        });
        form.setError('password', {
          type: 'manual',
          message: 'Tài khoản hoặc mật khẩu không chính xác'
        });
      }
      if (data?.error === null && data.url) {
        toast.success('Đăng nhập thành công', {
          description: 'Vui lòng chờ trong giây lát'
        });
        router.push(PATH.DASHBOARD);
      }
    },
    onError: (error) => {
      console.log('Error logging in:', error);
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    const { usernameOrEmail, password } = values;
    try {
      await login.mutateAsync({ usernameOrEmail, password });
    } catch (error) {
      console.log('Error logging in:', error);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Chào mừng trở lại</CardTitle>
          <CardDescription>
            Đăng nhập bằng tài khoản Google của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-6'>
            <div className='flex flex-col gap-4'>
              <GoogleButton />
            </div>
            <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
              <span className='relative z-10 bg-background px-2 text-muted-foreground'>
                Hoặc tiếp tục với email
              </span>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <div className='grid gap-6'>
                <div className='grid gap-6'>
                  <div className='grid gap-2'>
                    <FormField
                      control={form.control}
                      name='usernameOrEmail'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tài khoản hoặc Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Tài khoản hoặc Email'
                              disabled={login.isPending}
                              className={cn(
                                form.formState.errors.usernameOrEmail &&
                                  'border-red-500'
                              )}
                              aria-invalid={
                                !!form.formState.errors.usernameOrEmail
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid gap-2'>
                    <FormField
                      control={form.control}
                      name='password'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor='pwd'>Mật khẩu</FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Input
                                id='pwd'
                                placeholder='Mật khẩu'
                                type={showPassword ? 'text' : 'password'}
                                disabled={login.isPending}
                                className={cn(
                                  form.formState.errors.password &&
                                    'border-red-500'
                                )}
                                aria-invalid={!!form.formState.errors.password}
                                {...field}
                              />
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <Eye className='h-4 w-4' />
                                ) : (
                                  <EyeOff className='h-4 w-4' />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='text-right'>
                    <a
                      href='#'
                      className='text-sm text-muted-foreground underline-offset-4 hover:underline'
                    >
                      Quên mật khẩu?
                    </a>
                  </div>
                  <Button
                    type='submit'
                    className='w-full'
                    disabled={login.isPending}
                  >
                    {login.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </div>
                <div className='text-center text-sm'>
                  Bạn chưa có tài khoản?{' '}
                  <Link
                    href={PATH.REGISTER}
                    className='px-3 underline underline-offset-4 duration-200 hover:text-primary'
                  >
                    Đăng ký ngay
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary'>
        Bằng cách nhấp vào tiếp tục, bạn đồng ý với chúng tôi{' '}
        <a href='#'>Điều khoản dịch vụ</a> and{' '}
        <a href='#'>Chính sách bảo mật</a>.
      </div>
    </div>
  );
}
