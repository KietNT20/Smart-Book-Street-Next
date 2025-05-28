'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User as UserType } from '@/types/user-types';
import { User, X } from 'lucide-react';
import UserRoleDisplay from './user-role-display';

type Props = {
  user?: UserType | null;
  onReset: () => void;
};

const UserInfoCard = ({ user, onReset }: Props) => {
  return (
    <Card className='w-full'>
      <CardContent className='p-4'>
        <div className='mb-2 flex items-center justify-between'>
          <div className='flex items-center'>
            <User className='mr-2 text-matcha' size={18} />
            <span className='font-medium'>Người đăng ký</span>
          </div>
          <Button
            variant='outline'
            size='icon'
            onClick={onReset}
            type='button'
            className='h-8 w-8 p-0'
          >
            <X size={16} />
          </Button>
        </div>
        <div className='space-y-1 text-sm'>
          <div className='flex items-center gap-3'>
            <span className='text-muted-foreground'>Họ và tên:</span>
            <span className='font-medium'>{user?.fullName || 'N/A'}</span>
          </div>
          <div className='flex items-center gap-3'>
            <span className='text-muted-foreground'>Email:</span>
            <span className='font-medium'>{user?.email || 'N/A'}</span>
          </div>
          <div className='flex items-start gap-3'>
            <span className='text-muted-foreground'>Vai trò:</span>
            <div className='space-y-1'>
              {user?.userRoles && user.userRoles.length > 0 ? (
                <UserRoleDisplay
                  userRoles={user?.userRoles || []}
                  isApprovedOnly={true}
                />
              ) : (
                <span className='font-medium'>Chưa có vai trò</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
