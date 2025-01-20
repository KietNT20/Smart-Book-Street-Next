'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PATH } from '@/constant/path';
import { Gender } from '@/enums/gender-enums';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { RegisterFormValues, registerSchema } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      fullName: '',
      dob: new Date(),
      address: '',
      phone: '',
      gender: Gender.Male,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      console.log('Form values:', values);
      toast({
        title: 'Success',
        description: 'Đăng ký thành công',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Đăng ký tài khoản</CardTitle>
          <CardDescription>
            Đăng ký bằng tài khoản Google hoặc điền thông tin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button type="button" variant="outline" className="w-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="mr-2 h-5 w-5"
                    >
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Đăng ký bằng Google
                  </Button>
                </div>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Hoặc đăng ký bằng thông tin
                  </span>
                </div>

                <div className="grid gap-4">
                  {/* Username input */}
                  <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên tài khoản</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tên tài khoản"
                            className={cn(
                              form.formState.errors.userName && 'border-red-500'
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Full name input */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Họ và tên"
                            className={cn(
                              form.formState.errors.fullName && 'border-red-500'
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email input */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Email"
                            type="email"
                            className={cn(
                              form.formState.errors.email && 'border-red-500'
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password input */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Mật khẩu"
                              type={showPassword ? 'text' : 'password'}
                              className={cn(
                                form.formState.errors.password &&
                                  'border-red-500'
                              )}
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

                  {/* Date of birth input */}
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Ngày sinh</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="DD/MM/YYYY"
                              value={
                                field.value
                                  ? format(new Date(field.value), 'dd/MM/yyyy')
                                  : field.value
                              }
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const numbers = inputValue.replace(/\D/g, '');

                                // Format display value while typing
                                let formattedValue = numbers;
                                if (numbers.length >= 2) {
                                  formattedValue =
                                    numbers.slice(0, 2) +
                                    '/' +
                                    numbers.slice(2);
                                }
                                if (numbers.length >= 4) {
                                  formattedValue =
                                    formattedValue.slice(0, 5) +
                                    '/' +
                                    formattedValue.slice(5);
                                }

                                // Update input display
                                e.target.value = formattedValue;

                                // Try to create Date object when have enough numbers
                                if (numbers.length === 8) {
                                  const day = numbers.slice(0, 2);
                                  const month = numbers.slice(2, 4);
                                  const year = numbers.slice(4);

                                  try {
                                    const date = new Date(
                                      `${year}-${month}-${day}`
                                    );
                                    if (!isNaN(date.getTime())) {
                                      field.onChange(date);
                                    }
                                  } catch {
                                    field.onChange(null);
                                  }
                                } else {
                                  field.onChange(null);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  {/* Phone input */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Số điện thoại"
                            className={cn(
                              form.formState.errors.phone && 'border-red-500'
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Address input */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Địa chỉ"
                            className={cn(
                              form.formState.errors.address && 'border-red-500'
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Gender select */}
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giới tính</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={Gender.Male} id="male" />
                              <Label htmlFor="male">Nam</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={Gender.Female}
                                id="female"
                              />
                              <Label htmlFor="female">Nữ</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
                </Button>

                <div className="text-center text-sm">
                  Bạn đã có tài khoản?{' '}
                  <Link
                    href={PATH.LOGIN}
                    className="underline underline-offset-4 duration-200 hover:text-primary"
                  >
                    Đăng nhập ngay
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        Bằng cách nhấp vào tiếp tục, bạn đồng ý với chúng tôi{' '}
        <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách bảo mật</a>
        .
      </div>
    </div>
  );
}
