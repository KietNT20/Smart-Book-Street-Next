'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RoleEnums } from '@/enums/role';
import { User as UserType } from '@/types/user-types';
import { User, X } from 'lucide-react';
import UserRoleDisplay from './user-role-display';

type Props = {
  user?: UserType | null;
  isLoading: boolean;
  onConfirm: () => void;
  onReset: () => void;
  onTryAnotherEmail: () => void;
};

const UserConfirmationStep = ({
  user,
  isLoading,
  onConfirm,
  onReset,
  onTryAnotherEmail,
}: Props) => {
  const canRegisterStore = () => {
    if (
      !user?.userRoles ||
      !Array.isArray(user.userRoles) ||
      user.userRoles.length === 0
    )
      return false;

    return user.userRoles.some(
      (userRole) =>
        userRole &&
        userRole.role &&
        userRole.role.roleName &&
        userRole.isApproved === true &&
        (userRole.role.roleName === RoleEnums.STORE_OWNER ||
          userRole.role.roleName === RoleEnums.PUBLISHER)
    );
  };

  return (
    <div className='space-y-6'>
      <Card className='w-full'>
        <CardContent className='p-6'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center'>
              <User className='mr-2 text-matcha' size={20} />
              <h3>Thông tin người dùng</h3>
            </div>
            <Button
              variant='outline'
              size='icon'
              onClick={onReset}
              className='h-8 w-8 p-0'
            >
              <X size={16} />
            </Button>
          </div>

          {isLoading ? (
            <p className='text-sm text-muted-foreground'>
              Đang tải thông tin người dùng...
            </p>
          ) : user ? (
            <div className='space-y-3'>
              <div className='space-y-2 text-sm'>
                <div className='flex items-center gap-3'>
                  <span className='min-w-[100px] text-muted-foreground'>
                    Họ tên:
                  </span>
                  <span className='font-medium'>
                    {user?.fullName || 'Chưa cung cấp'}
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='min-w-[100px] text-muted-foreground'>
                    Email:
                  </span>
                  <span className='font-medium'>
                    {user?.email || 'Chưa cung cấp'}
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='min-w-[100px] text-muted-foreground'>
                    Số điện thoại:
                  </span>
                  <span className='font-medium'>
                    {user?.phone || 'Chưa cung cấp'}
                  </span>
                </div>

                <div className='flex items-start gap-3'>
                  <span className='min-w-[100px] text-muted-foreground'>
                    Vai trò:
                  </span>
                  <div className='space-y-1'>
                    <UserRoleDisplay userRoles={user?.userRoles} />
                  </div>
                </div>
              </div>

              <div className='pt-4'>
                {canRegisterStore() ? (
                  <Button onClick={onConfirm} className='w-full'>
                    Xác nhận và tiếp tục đăng ký
                  </Button>
                ) : (
                  <div className='space-y-3'>
                    <div className='rounded-lg bg-destructive/10 p-3 text-center'>
                      <p className='text-sm text-destructive'>
                        Người dùng này không có quyền đăng ký cửa hàng.
                        <br />
                        {`Cần có vai trò "Chủ cửa hàng" hoặc "Nhà xuất bản" và được phê duyệt.`}
                      </p>
                    </div>
                    <Button
                      variant='outline'
                      onClick={onTryAnotherEmail}
                      className='w-full'
                    >
                      Thử email khác
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className='py-4 text-center'>
              <p className='mb-4 text-sm text-muted-foreground'>
                Không tìm thấy người dùng với email này
              </p>
              <Button variant='outline' onClick={onTryAnotherEmail}>
                Thử email khác
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserConfirmationStep;
