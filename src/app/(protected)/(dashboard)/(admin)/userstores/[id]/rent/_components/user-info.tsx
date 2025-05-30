'use client';

import { User as UserType } from '@/types/user-types';
import { User } from 'lucide-react';
import UserRoleDisplay from './user-role-display';

type Props = {
  user: UserType | null;
};

export default function UserInfo({ user }: Props) {
  return (
    <>
      <div className='mb-3 flex items-center gap-2'>
        <User className='text-green-500' size={16} />
        <span className='font-medium text-green-700'>
          Đã tìm thấy người dùng
        </span>
      </div>
      <div className='grid grid-cols-1 gap-3 text-sm md:grid-cols-2'>
        <div>
          <span className='text-muted-foreground'>Họ và tên:</span>
          <span className='ml-2 font-medium'>{user?.fullName || 'N/A'}</span>
        </div>
        <div>
          <span className='text-muted-foreground'>Email:</span>
          <span className='ml-2 font-medium'>{user?.email || 'N/A'}</span>
        </div>
        <div>
          <span className='text-muted-foreground'>SĐT:</span>
          <span className='ml-2 font-medium'>{user?.phone || 'N/A'}</span>
        </div>
        <div className='flex items-start gap-2'>
          <span className='text-muted-foreground'>Vai trò:</span>
          <div>
            <UserRoleDisplay
              userRoles={user?.userRoles}
              isApprovedOnly={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}
