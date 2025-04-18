'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PATH } from '@/enums/path';
import { useUserById } from '@/hooks/use-user';
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
          <ArrowLeft className='mr-2 h-4 w-4' />
          Quay lại
        </Button>
        <h1 className='text-2xl font-bold'>Chi tiết người dùng</h1>
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        {/* Thông tin cơ bản */}
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2'>
              {user.userName && (
                <div>
                  <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                    Tên đăng nhập
                  </h3>
                  <p className='font-medium'>{user.userName}</p>
                </div>
              )}

              {user.email && (
                <div>
                  <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                    Email
                  </h3>
                  <p className='font-medium'>{user.email}</p>
                </div>
              )}

              {user.fullName && (
                <div>
                  <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                    Họ và tên
                  </h3>
                  <p className='font-medium'>{user.fullName}</p>
                </div>
              )}

              {user.phone && (
                <div>
                  <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                    Số điện thoại
                  </h3>
                  <p className='font-medium'>{user.phone}</p>
                </div>
              )}

              {user.gender && (
                <div>
                  <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                    Giới tính
                  </h3>
                  <p className='font-medium'>{user.gender}</p>
                </div>
              )}

              {user.dob && (
                <div>
                  <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                    Ngày sinh
                  </h3>
                  <p className='font-medium'>
                    {dayjs(user.dob).format('DD/MM/YYYY')}
                  </p>
                </div>
              )}

              {user.address && (
                <div className='md:col-span-2'>
                  <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                    Địa chỉ
                  </h3>
                  <p className='font-medium'>{user.address}</p>
                </div>
              )}
            </div>
          </CardContent>
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
                  <Mail className='mr-2 h-4 w-4' />
                  <span>{user.email}</span>
                </div>
              )}

              <div className='mt-4 grid w-full grid-cols-2 gap-2'>
                <Button
                  variant='outline'
                  onClick={() => router.push(`/users/edit/${user.id}`)}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  variant='default'
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

        {/* Quyền và vai trò */}
        {user.userRoles && user.userRoles.length > 0 && (
          <Card className='md:col-span-2'>
            <CardHeader>
              <CardTitle>Vai trò và quyền hạn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                {user.userRoles.map((role, index) => (
                  <div
                    key={index}
                    className='rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'
                  >
                    {role.role?.roleName || 'Chưa có vai trò'}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
