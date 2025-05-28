import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RoleLabels } from '@/enums/role';
import { useUserRoleMutation } from '@/hooks/use-user-roles';
import { UserRole } from '@/types/user-types';
import { Eye, Plus, Trash2, UserCog } from 'lucide-react';
import { useState } from 'react';

type RoleOption = {
  value: string | undefined;
  label: string;
};

type Props = {
  userId: string;
  userRoles: UserRole[];
  availableRoles: RoleOption[];
  isLoading?: boolean;
};

const UserRoleSelector = ({
  userId,
  userRoles = [],
  availableRoles,
  isLoading = false,
}: Props) => {
  const [isRolesDropdownOpen, setIsRolesDropdownOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'remove'>('add');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');

  const { addUserRole, isAddingRole, deleteUserRole, isDeletingRole } =
    useUserRoleMutation();

  // Get the roles that the user doesn't have yet
  const getAvailableRolesToAdd = () => {
    const currentRoleIds = userRoles.map((role) => role.roleId);
    return availableRoles.filter(
      (role) => !currentRoleIds.includes(role.value || '')
    );
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedRoleId('');
    setIsModalOpen(true);
    setIsActionMenuOpen(false);
  };

  const handleOpenRemoveModal = () => {
    setModalMode('remove');
    setSelectedRoleId(userRoles.length > 0 ? userRoles[0].roleId : '');
    setIsModalOpen(true);
    setIsActionMenuOpen(false);
  };

  const handleAddRole = () => {
    if (!selectedRoleId) return;

    addUserRole(
      {
        roleId: selectedRoleId,
        userId: userId,
        assignedAt: new Date().toISOString(),
        isApproved: true, // Assuming we want to auto-approve roles added this way
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      }
    );
  };

  const handleRemoveRole = () => {
    if (!selectedRoleId) return;

    deleteUserRole(
      {
        userId: userId,
        roleId: selectedRoleId,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      }
    );
  };

  const isProcessing = isAddingRole || isDeletingRole;
  const hasRoles =
    userRoles.some((role) => role.isApproved === true) && userRoles.length > 0;
  const canAddRoles = !isLoading && getAvailableRolesToAdd().length > 0;
  const canRemoveRoles = !isLoading && hasRoles;

  const getRoleLabel = (roleId: string) => {
    const roleInfo = availableRoles.find((r) => r.value === roleId);
    return roleInfo
      ? RoleLabels[roleInfo.label as keyof typeof RoleLabels] || roleInfo.label
      : roleId;
  };

  return (
    <div className='flex gap-2'>
      <div className='flex items-center gap-1'>
        {hasRoles && (
          <DropdownMenu
            open={isRolesDropdownOpen}
            onOpenChange={setIsRolesDropdownOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='h-7 w-7 p-0'
                disabled={isLoading}
              >
                <Eye className='size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
              <div className='p-2 text-sm font-medium'>
                Quyền của người dùng
              </div>
              <DropdownMenuSeparator />
              {userRoles.map((role) => (
                <DropdownMenuItem key={role.roleId} className='py-2'>
                  <Badge className='mr-2'>{getRoleLabel(role.roleId)}</Badge>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <DropdownMenu
          open={isActionMenuOpen}
          onOpenChange={setIsActionMenuOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='h-7 w-7 p-0'
              disabled={isLoading || isProcessing}
            >
              <UserCog className='size-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-36'>
            <DropdownMenuItem
              onClick={handleOpenAddModal}
              disabled={!canAddRoles || isProcessing}
              className='text-primary focus:text-primary'
            >
              <Plus className='mr-2 h-3.5 w-3.5' />
              Thêm quyền
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleOpenRemoveModal}
              disabled={!canRemoveRoles || isProcessing}
              className='text-destructive focus:text-destructive'
            >
              <Trash2 className='mr-2 h-3.5 w-3.5' />
              Xóa quyền
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Modal for adding/removing roles */}
      {isModalOpen && (
        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            if (!isProcessing) {
              setIsModalOpen(open);
            }
          }}
        >
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>
                {modalMode === 'add'
                  ? 'Thêm quyền người dùng'
                  : 'Xóa quyền người dùng'}
              </DialogTitle>
            </DialogHeader>

            <div className='py-4'>
              <Select
                value={selectedRoleId}
                onValueChange={setSelectedRoleId}
                disabled={isProcessing}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue
                    placeholder={
                      modalMode === 'add'
                        ? 'Chọn quyền để thêm'
                        : 'Chọn quyền để xóa'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {modalMode === 'add'
                    ? getAvailableRolesToAdd().map((role) => (
                        <SelectItem
                          key={role.value || ''}
                          value={role.value || ''}
                        >
                          {RoleLabels[role.label as keyof typeof RoleLabels] ||
                            role.label}
                        </SelectItem>
                      ))
                    : userRoles.map((role) => (
                        <SelectItem key={role.roleId} value={role.roleId}>
                          {getRoleLabel(role.roleId)}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => {
                  setIsModalOpen(false);
                }}
                disabled={isProcessing}
                type='button'
              >
                Hủy
              </Button>

              <Button
                onClick={modalMode === 'add' ? handleAddRole : handleRemoveRole}
                disabled={!selectedRoleId || isProcessing}
                variant={modalMode === 'add' ? 'default' : 'destructive'}
                type='button'
              >
                {isProcessing
                  ? 'Đang xử lý...'
                  : modalMode === 'add'
                    ? 'Thêm quyền'
                    : 'Xóa quyền'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserRoleSelector;
