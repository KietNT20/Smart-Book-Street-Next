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
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { useUserById } from '@/hooks/use-user';
import { getVietnameseRoleLabel } from '@/utils/format';
import dayjs from 'dayjs';
import { ArrowLeft, Mail, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import UserDetailSkeleton from './_components/user-skeleton';

export default function UserDetailPage({
  params,
}: {
  params: { userId: string };
}) {
  const { user, userLoading, userError } = useUserById(params.userId);
  const router = useRouter();
  useEntityBreadcrumb(
    PATH.USERS,
    'Người dùng',
    params.userId,
    user?.userName || user?.email || 'Tài khoản'
  );

  if (userLoading) {
    return <UserDetailSkeleton />;
  }

  if (userError || !user) {
    return (
      <Card className='mx-auto max-w-3xl'>
        <CardContent className='pt-6'>
          <div className='flex flex-col items-center justify-center py-10 text-center'>
            <h2 className='mb-2 text-xl font-semibold'>
              Không tìm thấy thông tin người dùng
            </h2>
            <p className='mb-6 text-muted-foreground'>
              Thông tin người dùng không tồn tại hoặc đã bị xóa
            </p>
            <Button onClick={() => router.replace(PATH.USERS)}>
              Quay lại danh sách
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='container py-8'>
      <div className='mb-6 flex items-center'>
        <Button
          variant='ghost'
          className='mr-4'
          onClick={() => router.push(PATH.USERS)}
        >
          <ArrowLeft className='mr-2 size-4' />
          Quay lại
        </Button>
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        {/* Thông tin cơ bản */}
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle className='text-center'>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent className='pt-5'>
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='grid gap-2'>
                <Label
                  htmlFor='username'
                  className='text-sm font-medium text-muted-foreground'
                >
                  Tên đăng nhập
                </Label>
                <Input
                  id='username'
                  value={user?.userName || 'Chưa có'}
                  disabled
                  className='bg-muted/50'
                />
              </div>

              <div className='grid gap-2'>
                <Label
                  htmlFor='email'
                  className='text-sm font-medium text-muted-foreground'
                >
                  Email
                </Label>
                <Input
                  id='email'
                  value={user?.email || 'Chưa có'}
                  disabled
                  className='bg-muted/50'
                />
              </div>

              <div className='grid gap-2'>
                <Label
                  htmlFor='fullname'
                  className='text-sm font-medium text-muted-foreground'
                >
                  Họ và tên
                </Label>
                <Input
                  id='fullname'
                  value={user?.fullName || 'Chưa có'}
                  disabled
                  className='bg-muted/50'
                />
              </div>

              <div className='grid gap-2'>
                <Label
                  htmlFor='phone'
                  className='text-sm font-medium text-muted-foreground'
                >
                  Số điện thoại
                </Label>
                <Input
                  id='phone'
                  value={user?.phone || 'Chưa có'}
                  disabled
                  className='bg-muted/50'
                />
              </div>

              <div className='grid gap-2'>
                <Label
                  htmlFor='gender'
                  className='text-sm font-medium text-muted-foreground'
                >
                  Giới tính
                </Label>
                <Input
                  id='gender'
                  value={user?.gender || 'Chưa có'}
                  disabled
                  className='bg-muted/50'
                />
              </div>

              <div className='grid gap-2'>
                <Label
                  htmlFor='dob'
                  className='text-sm font-medium text-muted-foreground'
                >
                  Ngày sinh
                </Label>
                <Input
                  id='dob'
                  value={
                    user?.dob ? dayjs(user.dob).format('DD/MM/YYYY') : 'Chưa có'
                  }
                  disabled
                  className='bg-muted/50'
                />
              </div>

              <div className='grid gap-2 md:col-span-2'>
                <Label
                  htmlFor='address'
                  className='text-sm font-medium text-muted-foreground'
                >
                  Địa chỉ
                </Label>
                <Input
                  id='address'
                  value={user?.address || 'Chưa có'}
                  disabled
                  className='bg-muted/50'
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {/* Quyền và vai trò */}
            {user.userRoles && user.userRoles.length > 0 && (
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
              {user.mainImageFile ? (
                <div className='relative mb-4 h-40 w-40 overflow-hidden rounded-full'>
                  <Image
                    src={user.mainImageFile}
                    alt={user.fullName || user.userName}
                    fill
                    className='object-cover'
                  />
                </div>
              ) : (
                <div className='mb-4 flex h-40 w-40 items-center justify-center rounded-full bg-muted'>
                  <User className='h-20 w-20 text-muted-foreground' />
                </div>
              )}

              <h2 className='mb-1 text-xl font-bold'>{user.fullName}</h2>
              <p className='mb-4 text-muted-foreground'>@{user.userName}</p>

              {user.email && (
                <div className='mb-2 flex items-center text-muted-foreground'>
                  <Mail className='mr-2 size-4' />
                  <span>{user.email}</span>
                </div>
              )}

              <div className='mt-4 grid w-full'>
                <Button
                  variant='darker'
                  onClick={() =>
                    (window.location.href = `mailto:${user.email}`)
                  }
                >
                  Liên hệ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
