'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRolePending, useUserRoleMutation } from '@/hooks/use-user-roles';
import { UserRole } from '@/types/user-types';
import { Empty } from 'antd';
import { useEffect, useState } from 'react';
import RoleRequestItem from './role-req-item';

const PendingRoleRequests = () => {
  const [pendingCount, setPendingCount] = useState<number>(0);
  const { approveUserRole } = useUserRoleMutation();
  const { rolesAtPending } = useRolePending();

  useEffect(() => {
    setPendingCount(rolesAtPending?.length || 0);
  }, [rolesAtPending]);

  const handleApprove = (request: UserRole): void => {
    approveUserRole({
      userId: request.userId,
      roleId: request.roleId,
      approved: true,
    });
  };

  const handleReject = (request: UserRole): void => {
    approveUserRole({
      userId: request.userId,
      roleId: request.roleId,
      approved: false,
    });
  };

  return (
    <Card className='border-2 border-dashed border-blue-100 bg-blue-50/50'>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-blue-700'>Đang chờ phê duyệt</CardTitle>
          {pendingCount > 0 && (
            <Badge variant='destructive'>{pendingCount}</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {rolesAtPending?.length > 0 ? (
          <div className='max-h-[400px] space-y-2 overflow-y-auto pr-2'>
            {rolesAtPending.map((request) => (
              <RoleRequestItem
                key={`${request.userId}-${request.roleId}`}
                request={request}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        ) : (
          <Empty description='Không có yêu cầu phân quyền đang chờ xử lý' />
        )}
      </CardContent>
    </Card>
  );
};

export default PendingRoleRequests;
