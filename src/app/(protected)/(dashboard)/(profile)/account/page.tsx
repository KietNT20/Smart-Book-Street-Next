'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PATH } from '@/enums/path';
import { useAuth } from '@/hooks/use-auth';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { getVietnameseRoleLabel } from '@/utils/format';
import dayjs from 'dayjs';
import { ArrowLeft, Mail, User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import AccountForm from './_components/account-form';
import UserDetailSkeleton from './_components/user-skeleton';
import useProfileForm, { UseUserFormProps } from './_hooks/use-profile-form';

export default function ProfilePage() {
  const { user, isLoading: userLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  const { isEditing, startEditing, cancelEdit } = useProfileForm({
    user: user as UseUserFormProps['user'],
  });

  useEntityBreadcrumb(
    PATH.ACCOUNT,
    'Thông tin tài khoản',
    'Tài khoản',
    user?.userName || user?.email
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  if (userLoading || !isClient) {
    return <UserDetailSkeleton />;
  }

  return (
    <div className='container py-8'>
      <div className='mb-6 flex items-center'>
        {isEditing && (
          <Button variant='ghost' className='mr-4' onClick={cancelEdit}>
            <ArrowLeft className='mr-2 size-4' />
            Quay lại
          </Button>
        )}
      </div>

      {!isEditing ? (
        // VIEW MODE - Hiển thị thông tin
        <div className='grid gap-6 md:grid-cols-3'>
          {/* Thông tin cơ bản */}
          <Card className='md:col-span-2'>
            <CardHeader>
              <CardTitle className='text-center'>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className='pt-5'>
              <div className='grid gap-6 md:grid-cols-2'>
                <div className='grid gap-2'>
                  <Label className='text-sm font-medium text-muted-foreground'>
                    Tên đăng nhập
                  </Label>
                  <Input
                    value={user?.userName || 'Chưa có'}
                    className='pointer-events-none bg-background text-card-foreground'
                  />
                </div>

                <div className='grid gap-2'>
                  <Label className='text-sm font-medium text-muted-foreground'>
                    Email
                  </Label>
                  <Input
                    value={user?.email || 'Chưa có'}
                    className='pointer-events-none bg-background text-card-foreground'
                  />
                </div>

                <div className='grid gap-2'>
                  <Label className='text-sm font-medium text-muted-foreground'>
                    Họ và tên
                  </Label>
                  <Input
                    value={user?.fullName || 'Chưa có'}
                    className='pointer-events-none bg-background text-card-foreground'
                  />
                </div>

                <div className='grid gap-2'>
                  <Label className='text-sm font-medium text-muted-foreground'>
                    Số điện thoại
                  </Label>
                  <Input
                    value={user?.phone || 'Chưa có'}
                    className='pointer-events-none bg-background text-card-foreground'
                  />
                </div>

                <div className='grid gap-2'>
                  <Label className='text-sm font-medium text-muted-foreground'>
                    Giới tính
                  </Label>
                  <Input
                    value={user?.gender || 'Chưa có'}
                    className='pointer-events-none bg-background text-card-foreground'
                  />
                </div>

                <div className='grid gap-2'>
                  <Label className='text-sm font-medium text-muted-foreground'>
                    Ngày sinh
                  </Label>
                  <Input
                    value={
                      user?.dob
                        ? dayjs(user?.dob).format('DD/MM/YYYY')
                        : 'Chưa có'
                    }
                    className='pointer-events-none bg-background text-card-foreground'
                  />
                </div>

                <div className='grid gap-2 md:col-span-2'>
                  <Label className='text-sm font-medium text-muted-foreground'>
                    Địa chỉ
                  </Label>
                  <Input
                    value={user?.address || 'Chưa có'}
                    className='pointer-events-none bg-background text-card-foreground'
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {/* Quyền và vai trò */}
              {user?.userRoles && user.userRoles.length > 0 && (
                <Card className='w-full'>
                  <CardHeader>
                    <CardTitle className='text-center'>
                      Vai trò và quyền hạn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='flex flex-wrap gap-2'>
                      {user.userRoles.map((role, index) => (
                        <div
                          key={index}
                          className='rounded-full bg-darker px-3 py-1 text-base font-medium text-darker-foreground'
                        >
                          {role.role
                            ? getVietnameseRoleLabel(role.role?.roleName)
                            : 'Chưa có vai trò'}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardFooter>
          </Card>

          {/* Ảnh đại diện và thông tin nhanh */}
          <Card>
            <CardContent className='pt-6'>
              <div className='flex flex-col items-center text-center'>
                {user?.mainImageFile ? (
                  <div className='relative mb-4 h-40 w-40 overflow-hidden rounded-full'>
                    <Image
                      src={user.mainImageFile}
                      alt={user.fullName || user.userName || ''}
                      fill
                      className='object-cover'
                    />
                  </div>
                ) : (
                  <div className='mb-4 flex h-40 w-40 items-center justify-center rounded-full bg-muted'>
                    <User className='h-20 w-20 text-muted-foreground' />
                  </div>
                )}

                <h2 className='mb-1 text-xl font-bold'>{user?.fullName}</h2>
                <p className='mb-4 text-muted-foreground'>@{user?.userName}</p>

                {user?.email && (
                  <div className='mb-2 flex items-center text-muted-foreground'>
                    <Mail className='mr-2 size-4' />
                    <span>{user.email}</span>
                  </div>
                )}

                <div className='mt-4 grid w-full'>
                  <Button variant='darker' onClick={startEditing}>
                    Chỉnh sửa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // EDIT MODE
        <AccountForm />
      )}
    </div>
  );
}
