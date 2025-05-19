'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChangePassFirstTime } from '@/hooks/use-user';
import { cn } from '@/lib/utils';
import { AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const passwordSchema = z
  .object({
    usernameOrEmail: z
      .string()
      .min(1, 'Tên đăng nhập hoặc email không được để trống'),
    currentPassword: z.string().min(1, 'Mật khẩu hiện tại không được để trống'),
    newPassword: z
      .string()
      .min(8, { message: 'Mật khẩu cần ít nhất 8 kí tự' })
      .max(32, 'Mật khẩu không được quá 32 kí tự')
      .regex(/[A-Z]/, { message: 'Mật khẩu cần ít nhất 1 chữ hoa' })
      .regex(/[a-z]/, { message: 'Mật khẩu cần ít nhất 1 chữ thường' })
      .regex(/[0-9]/, { message: 'Mật khẩu cần ít nhất 1 số' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Mật khẩu cần ít nhất 1 kí tự đặc biệt',
      }),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })
  .refine((data) => !/[^\x00-\x7F]/.test(data.newPassword), {
    message: 'Mật khẩu không được chứa emoji hoặc ký tự đặc biệt không hợp lệ',
    path: ['newPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function FirstTimePasswordChangePage() {
  const [formValues, setFormValues] = useState<
    Omit<PasswordFormValues, 'confirmPassword'> & { confirmPassword: string }
  >({
    usernameOrEmail: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof PasswordFormValues, string>>
  >({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const { changePassFirstTime, changePassFirstTimePending } =
    useChangePassFirstTime();

  const validateForm = (): boolean => {
    try {
      passwordSchema.parse(formValues);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof PasswordFormValues, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof PasswordFormValues] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleInputChange = (
    field: keyof PasswordFormValues,
    value: string
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    // Xóa lỗi khi người dùng gõ
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    changePassFirstTime(
      {
        usernameOrEmail: formValues.usernameOrEmail,
        currentPassword: formValues.currentPassword,
        newPassword: formValues.newPassword,
      },
      {
        onSuccess: () => {
          toast.success('Đổi mật khẩu thành công', {
            description:
              'Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập lại.',
          });

          setTimeout(() => {
            router.push('/login');
          }, 2000);
        },
      }
    );
  };

  const passwordStrength = (): { strength: string; color: string } => {
    const { newPassword } = formValues;
    if (!newPassword) return { strength: 'Rất yếu', color: 'bg-red-500' };

    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[a-z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    switch (score) {
      case 0:
      case 1:
        return { strength: 'Rất yếu', color: 'bg-red-500' };
      case 2:
        return { strength: 'Yếu', color: 'bg-orange-500' };
      case 3:
        return { strength: 'Trung bình', color: 'bg-yellow-500' };
      case 4:
        return { strength: 'Mạnh', color: 'bg-blue-500' };
      case 5:
        return { strength: 'Rất mạnh', color: 'bg-green-500' };
      default:
        return { strength: 'Rất yếu', color: 'bg-red-500' };
    }
  };

  const strengthInfo = passwordStrength();

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-center text-2xl font-bold'>
            Đổi mật khẩu lần đầu
          </CardTitle>
          <CardDescription className='text-center'>
            Bạn cần đổi mật khẩu trước khi tiếp tục sử dụng hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='usernameOrEmail'>Tên đăng nhập hoặc Email</Label>
              <Input
                id='usernameOrEmail'
                placeholder='Nhập tên đăng nhập hoặc email'
                value={formValues.usernameOrEmail}
                onChange={(e) =>
                  handleInputChange('usernameOrEmail', e.target.value)
                }
                className={cn(errors.usernameOrEmail && 'border-red-500')}
              />
              {errors.usernameOrEmail && (
                <p className='text-sm text-red-500'>{errors.usernameOrEmail}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='currentPassword'>Mật khẩu hiện tại</Label>
              <div className='relative'>
                <Input
                  id='currentPassword'
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder='Nhập mật khẩu hiện tại'
                  value={formValues.currentPassword}
                  onChange={(e) =>
                    handleInputChange('currentPassword', e.target.value)
                  }
                  className={cn(errors.currentPassword && 'border-red-500')}
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='absolute right-0 top-0 h-full px-3'
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <Eye className='h-4 w-4' />
                  ) : (
                    <EyeOff className='h-4 w-4' />
                  )}
                </Button>
              </div>
              {errors.currentPassword && (
                <p className='text-sm text-red-500'>{errors.currentPassword}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='newPassword'>Mật khẩu mới</Label>
              <div className='relative'>
                <Input
                  id='newPassword'
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder='Nhập mật khẩu mới'
                  value={formValues.newPassword}
                  onChange={(e) =>
                    handleInputChange('newPassword', e.target.value)
                  }
                  className={cn(errors.newPassword && 'border-red-500')}
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='absolute right-0 top-0 h-full px-3'
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <Eye className='h-4 w-4' />
                  ) : (
                    <EyeOff className='h-4 w-4' />
                  )}
                </Button>
              </div>
              {errors.newPassword && (
                <p className='text-sm text-red-500'>{errors.newPassword}</p>
              )}

              {formValues.newPassword && (
                <div className='mt-2 space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>Độ mạnh mật khẩu:</span>
                    <span>{strengthInfo.strength}</span>
                  </div>
                  <div className='h-2 w-full rounded-full bg-gray-200'>
                    <div
                      className={`h-full rounded-full ${strengthInfo.color}`}
                      style={{
                        width: `${
                          passwordStrength().strength === 'Rất yếu'
                            ? 20
                            : passwordStrength().strength === 'Yếu'
                              ? 40
                              : passwordStrength().strength === 'Trung bình'
                                ? 60
                                : passwordStrength().strength === 'Mạnh'
                                  ? 80
                                  : 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Xác nhận mật khẩu mới</Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Nhập lại mật khẩu mới'
                  value={formValues.confirmPassword}
                  onChange={(e) =>
                    handleInputChange('confirmPassword', e.target.value)
                  }
                  className={cn(errors.confirmPassword && 'border-red-500')}
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='absolute right-0 top-0 h-full px-3'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <Eye className='h-4 w-4' />
                  ) : (
                    <EyeOff className='h-4 w-4' />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className='text-sm text-red-500'>{errors.confirmPassword}</p>
              )}
            </div>

            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Lưu ý</AlertTitle>
              <AlertDescription>
                Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ
                thường, số và ký tự đặc biệt.
              </AlertDescription>
            </Alert>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            className='w-full'
            type='submit'
            onClick={handleSubmit}
            disabled={changePassFirstTimePending}
          >
            {changePassFirstTimePending ? (
              <div className='flex items-center'>
                <svg
                  className='-ml-1 mr-3 h-5 w-5 animate-spin text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Đang xử lý...
              </div>
            ) : (
              <div className='flex items-center'>
                <Lock className='mr-2 h-4 w-4' />
                Đổi mật khẩu
              </div>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
