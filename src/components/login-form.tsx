'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PATH } from '@/constant/path';
import { useLogin } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { LoginFormValues, loginSchema } from '@/lib/zod';
import { AuthError } from '@/types/auth.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import GoogleButton from './google-button/google-button';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';

// Define props interface

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [showPassword, setShowPassword] = useState(false);

  const login = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login.mutateAsync(values);
    } catch (error: any) {
      if ((error as AuthError)?.type === 'CredentialsSignin') {
        // Set error cho cả 2 field
        form.setError('usernameOrEmail', {
          type: 'manual',
          message: 'Tài khoản hoặc mật khẩu không chính xác',
        });
        form.setError('password', {
          type: 'manual',
          message: 'Tài khoản hoặc mật khẩu không chính xác',
        });
      }
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Chào mừng trở lại</CardTitle>
          <CardDescription>
            Đăng nhập bằng tài khoản Google của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <GoogleButton signIn />
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Hoặc tiếp tục với email
              </span>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="usernameOrEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Tài khoản hoặc email"
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
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="pwd">Mật khẩu</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                id="pwd"
                                placeholder="Mật khẩu"
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
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeOff className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="text-right">
                    <a
                      href="#"
                      className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Quên mật khẩu?
                    </a>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={login.isPending}
                  >
                    {login.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Bạn chưa có tài khoản?{' '}
                  <Link
                    href={PATH.REGISTER}
                    className="px-3 underline underline-offset-4 duration-200 hover:text-primary"
                  >
                    Đăng ký ngay
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        Bằng cách nhấp vào tiếp tục, bạn đồng ý với chúng tôi{' '}
        <a href="#">Điều khoản dịch vụ</a> and{' '}
        <a href="#">Chính sách bảo mật</a>.
      </div>
    </div>
  );
}
