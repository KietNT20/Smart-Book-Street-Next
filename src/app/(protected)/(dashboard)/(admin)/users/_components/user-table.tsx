import { ConfirmModal } from '@/components/confirm-modal';
import TablePagination from '@/components/pagination/table-pagination';
import UserRoleSelector from '@/components/select/select-role';
import { TableSkeleton } from '@/components/table-skeleton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Sort } from '@/enums/enums';
import { PATH } from '@/enums/path';
import { useRoles } from '@/hooks/use-role';
import { useUserMutation } from '@/hooks/use-user';
import { formateDateVi } from '@/lib/utils';
import { User } from '@/types/user-types';
import {
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  SortAsc,
  SortDesc,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type Props = {
  users: User[];
  isLoading: boolean;
  isSearching: boolean;
  totalPages: number;
  pageNumber: number;
  setPageNumber: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  sortField: string;
  sortOrder: Sort;
  handleSort: (field: string) => void;
};

const UserTable = ({
  users,
  isLoading,
  isSearching,
  totalPages,
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
  sortField,
  sortOrder,
  handleSort,
}: Props) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const { deleteUser } = useUserMutation();
  const { roles, isLoading: isLoadingRoles } = useRoles();

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setPageNumber(1); // Reset to first page when changing page size
  };

  // Handle opening delete dialog
  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteUser(userToDelete);

      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <>
      <div className='rounded-md border'>
        <div className='w-full overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-right'>No.</TableHead>
                <TableHead
                  className='cursor-pointer'
                  onClick={() => handleSort('UserName')}
                >
                  <Button variant='ghost'>
                    Tài khoản
                    {sortField === 'UserName' ? (
                      sortOrder === Sort.ASC ? (
                        <SortAsc className='ml-2 h-4 w-4' />
                      ) : (
                        <SortDesc className='ml-2 h-4 w-4' />
                      )
                    ) : (
                      <ArrowUpDown className='ml-2 h-4 w-4' />
                    )}
                  </Button>
                </TableHead>
                <TableHead
                  className='cursor-pointer'
                  onClick={() => handleSort('FullName')}
                >
                  <Button variant='ghost'>
                    Tên nguời dùng
                    {sortField === 'FullName' ? (
                      sortOrder === Sort.ASC ? (
                        <SortAsc className='ml-2 h-4 w-4' />
                      ) : (
                        <SortDesc className='ml-2 h-4 w-4' />
                      )
                    ) : (
                      <ArrowUpDown className='ml-2 h-4 w-4' />
                    )}
                  </Button>
                </TableHead>
                <TableHead
                  className='cursor-pointer'
                  onClick={() => handleSort('Email')}
                >
                  <Button variant='ghost'>
                    Email
                    {sortField === 'Email' ? (
                      sortOrder === Sort.ASC ? (
                        <SortAsc className='ml-2 h-4 w-4' />
                      ) : (
                        <SortDesc className='ml-2 h-4 w-4' />
                      )
                    ) : (
                      <ArrowUpDown className='ml-2 h-4 w-4' />
                    )}
                  </Button>
                </TableHead>
                <TableHead
                  className='cursor-pointer'
                  onClick={() => handleSort('Phone')}
                >
                  <Button variant='ghost'>
                    Số điện thoại
                    {sortField === 'Phone' ? (
                      sortOrder === Sort.ASC ? (
                        <SortAsc className='ml-2 h-4 w-4' />
                      ) : (
                        <SortDesc className='ml-2 h-4 w-4' />
                      )
                    ) : (
                      <ArrowUpDown className='ml-2 h-4 w-4' />
                    )}
                  </Button>
                </TableHead>
                <TableHead className='' onClick={() => handleSort('DOB')}>
                  {' '}
                  <Button variant='ghost'>
                    Ngày sinh
                    {sortField === 'DOB' ? (
                      sortOrder === Sort.ASC ? (
                        <SortAsc className='ml-2 h-4 w-4' />
                      ) : (
                        <SortDesc className='ml-2 h-4 w-4' />
                      )
                    ) : (
                      <ArrowUpDown className='ml-2 h-4 w-4' />
                    )}
                  </Button>
                </TableHead>
                <TableHead className=''>Vai trò</TableHead>
                <TableHead className='text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton columns={7} rows={pageSize} />
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='py-10 text-center'>
                    Không tìm thấy người dùng.{' '}
                    {isSearching && 'Hãy thử một từ khóa tìm kiếm khác.'}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow key={user.id || index}>
                    <TableCell className='text-muted-foreground'>
                      {index + 1 + (pageNumber - 1) * pageSize}
                    </TableCell>
                    <TableCell className='font-medium'>
                      {user.userName}
                    </TableCell>
                    <TableCell className=''>{user.fullName}</TableCell>
                    <TableCell className=''>{user.email}</TableCell>
                    <TableCell className=''>{user.phone}</TableCell>
                    <TableCell className=''>
                      {formateDateVi(user.dob)}
                    </TableCell>
                    <TableCell>
                      <UserRoleSelector
                        userId={user.id || ''}
                        userRoles={user.userRoles || []}
                        availableRoles={roles}
                        isLoading={isLoadingRoles}
                      />
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuItem asChild className='cursor-pointer'>
                            <Link href={`${PATH.USERS}/${user.id}`}>
                              <Eye className='mr-2 h-4 w-4' />
                              Xem chi tiết
                            </Link>
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem
                            onClick={() => onEditUser(user.id || '')}
                          >
                            <FileEdit className='mr-2 h-4 w-4' />
                            Chỉnh sửa
                          </DropdownMenuItem> */}
                          <DropdownMenuItem
                            className='text-destructive'
                            onClick={() => handleDeleteClick(user.id || '')}
                          >
                            <Trash2 className='mr-2 h-4 w-4' />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination and page size controls */}
      <div className='mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row'>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>Số dòng:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className='h-8 w-16'>
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='30'>30</SelectItem>
              <SelectItem value='40'>40</SelectItem>
              <SelectItem value='50'>50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TablePagination
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          totalPages={totalPages}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        variant='destructive'
        title='Xác nhận xóa'
        description='Bạn có chắc chắn muốn xóa Tài Khoản này không? Hành động này không thể hoàn tác.'
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default UserTable;
