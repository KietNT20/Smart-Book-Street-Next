import { ConfirmModal } from '@/components/confirm-modal';
import { UserRoleSelector } from '@/components/select/select-role';
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
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
import { usePublisherMutation } from '@/hooks/use-publisher';
import { useRoles } from '@/hooks/use-role';
import { User } from '@/types/user-types';
import {
  ArrowUpDown,
  Eye,
  FileEdit,
  MoreHorizontal,
  SortAsc,
  SortDesc,
  Trash2,
} from 'lucide-react';
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
  onViewStore: (id: string) => void;
  onEditStore: (id: string) => void;
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
  onViewStore,
  onEditStore,
}: Props) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [publisherToDelete, setPublisherToDelete] = useState<string | null>(
    null
  );

  const { deletePublisher } = usePublisherMutation();

  const { roles, isLoading: isLoadingRoles } = useRoles();

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setPageNumber(1); // Reset to first page when changing page size
  };

  // Handle opening delete dialog
  const handleDeleteClick = (publisherId: string) => {
    setPublisherToDelete(publisherId);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (publisherToDelete) {
      // Call API to delete store with the store ID
      deletePublisher(publisherToDelete);

      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setPublisherToDelete(null);
    }
  };

  const totalPagesCount = totalPages || 10;
  const pagesToShow = Math.min(5, totalPagesCount);
  const startPage = Math.max(
    1,
    Math.min(
      pageNumber - Math.floor(pagesToShow / 2),
      totalPagesCount - pagesToShow + 1
    )
  );
  return (
    <>
      {/* Table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
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
              <TableHead>Date of birth</TableHead>
              <TableHead>Vai trò</TableHead>
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
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className='font-medium'>{user.userName}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.dob}</TableCell>
                  <TableCell>
                    <UserRoleSelector
                      userId={user.id || ''}
                      currentRoleId={user.userRoles}
                      roles={roles}
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
                        <DropdownMenuItem
                          onClick={() => onViewStore(user.id || '')}
                        >
                          <Eye className='mr-2 h-4 w-4' />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEditStore(user.id || '')}
                        >
                          <FileEdit className='mr-2 h-4 w-4' />
                          Chỉnh sửa
                        </DropdownMenuItem>
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

      {/* Pagination and page size controls */}
      <div className='mt-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='whitespace-nowrap text-sm text-muted-foreground'>
            Số dòng:
          </span>
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

        <Pagination className='m-0 flex items-center justify-end'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  setPageNumber(Math.max(pageNumber - 1, 1));
                }}
              />
            </PaginationItem>

            {pageNumber > 3 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      setPageNumber(1);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {pageNumber > 4 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </>
            )}

            {Array.from({ length: pagesToShow }).map((_, index) => {
              const page = startPage + index;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      setPageNumber(page);
                    }}
                    isActive={pageNumber === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {pageNumber < totalPagesCount - 2 && (
              <>
                {pageNumber < totalPagesCount - 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      setPageNumber(totalPagesCount);
                    }}
                  >
                    {totalPagesCount}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  setPageNumber(Math.min(pageNumber + 1, totalPagesCount));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        variant='destructive'
        title='Xác nhận xóa'
        description='Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác.'
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default UserTable;
