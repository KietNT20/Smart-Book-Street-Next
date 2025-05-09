'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDateVi } from '@/lib/utils';
import { User as UserType } from '@/types/user-types';
import { Calendar, Mail, MapPin, Phone, User } from 'lucide-react';

type UserDetailsTabProps = {
  user: UserType | null | undefined;
};

const UserDetailsTab = ({ user }: UserDetailsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông Tin Người Thuê</CardTitle>
        <CardDescription>
          Thông tin về người thuê trong hợp đồng này
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <User className='h-5 w-5 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Tên Đăng Nhập
                </p>
                <p className='font-medium'>
                  {user?.userName || 'Chưa cung cấp'}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <User className='h-5 w-5 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Họ và Tên
                </p>
                <p className='font-medium'>
                  {user?.fullName || 'Chưa cung cấp'}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Mail className='h-5 w-5 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Email
                </p>
                <p className='font-medium'>{user?.email || 'Chưa cung cấp'}</p>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-5 w-5 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Ngày Sinh
                </p>
                <p className='font-medium'>
                  {formatDateVi(user?.dob || null) || 'Chưa cung cấp'}
                </p>
              </div>
            </div>

            {user?.phone && (
              <div className='flex items-center gap-2'>
                <Phone className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Số Điện Thoại
                  </p>
                  <p className='font-medium'>
                    {user?.phone || 'Chưa cung cấp'}
                  </p>
                </div>
              </div>
            )}

            {user?.address && (
              <div className='flex items-center gap-2'>
                <MapPin className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Địa Chỉ
                  </p>
                  <p className='font-medium'>
                    {user?.address || 'Chưa cung cấp'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className='justify-end'>
        <Button variant='outline'>Xem Hồ Sơ Người Dùng</Button>
      </CardFooter>
    </Card>
  );
};
export default UserDetailsTab;
