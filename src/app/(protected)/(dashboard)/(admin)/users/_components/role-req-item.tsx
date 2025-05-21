import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RoleEnums, RoleLabels } from '@/enums/role';
import { useRolesAvailable } from '@/hooks/use-role';
import { useUserById } from '@/hooks/use-user';
import { UserRole } from '@/types/user-types';
import { Shield } from 'lucide-react';

interface RoleRequestItemProps {
  request: UserRole;
  onApprove: (request: UserRole) => void;
  onReject: (request: UserRole) => void;
}

const RoleRequestItem = ({
  request,
  onApprove,
  onReject,
}: RoleRequestItemProps) => {
  const { user, userLoading } = useUserById(request.userId);
  const { rolesAvailable } = useRolesAvailable();

  const getRoleName = (roleId: string): string => {
    const role = rolesAvailable.find((role) => role.value === roleId);
    return RoleLabels[role?.label as RoleEnums] || 'Chưa xác định';
  };

  const getInitials = (name: string): string => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (userLoading) {
    return (
      <div className='flex items-center justify-between rounded-md border bg-background p-3 shadow-sm'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <Skeleton className='h-5 w-32' />
        </div>
        <Skeleton className='h-5 w-24' />
        <Skeleton className='h-9 w-24' />
      </div>
    );
  }

  return (
    <div className='flex items-center justify-between rounded-md border bg-background p-3 shadow-sm transition-colors hover:bg-muted/30'>
      <div className='flex items-center gap-3'>
        <Avatar className='h-10 w-10'>
          <AvatarFallback className='bg-primary text-primary-foreground'>
            {getInitials(user?.fullName || '')}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className='font-medium'>{user?.fullName}</p>
          <p className='text-xs text-muted-foreground'>{user?.email}</p>
        </div>
      </div>

      <div className='hidden md:block'>
        <Badge variant='outline' className='flex items-center gap-1'>
          <Shield className='h-3 w-3' />
          {getRoleName(request.roleId)}
        </Badge>
      </div>

      <div className='flex gap-2'>
        <Button
          size='sm'
          onClick={() => onReject(request)}
          variant='destructive'
        >
          Từ chối
        </Button>
        <Button size='sm' onClick={() => onApprove(request)}>
          Phê duyệt
        </Button>
      </div>
    </div>
  );
};

export default RoleRequestItem;
