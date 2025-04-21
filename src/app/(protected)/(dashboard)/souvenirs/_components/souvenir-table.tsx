import { ConfirmModal } from '@/components/confirm-modal';
import TablePagination from '@/components/pagination/table-pagination';
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
import { useSouvenirMutation } from '@/hooks/use-souvenir';
import { Souvenir } from '@/types/souvenir-types';
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
  souvenirs: Souvenir[];
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
  onViewSouvenir: (id: string) => void;
  onEditSouvenir: (id: string) => void;
};

const SouvenirTable = ({
  souvenirs,
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
  onViewSouvenir,
  onEditSouvenir,
}: Props) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [souvenirToDelete, setSouvenirToDelete] = useState<string | null>(null);

  const { deleteSouvenir } = useSouvenirMutation();

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setPageNumber(1); // Reset to first page when changing page size
  };

  // Handle opening delete dialog
  const handleDeleteClick = (souvenirId: string) => {
    setSouvenirToDelete(souvenirId);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (souvenirToDelete) {
      // Call API to delete souvenir with the souvenir ID
      deleteSouvenir(souvenirToDelete);

      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setSouvenirToDelete(null);
    }
  };

  return (
    <>
      {/* Table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead
                className='cursor-pointer'
                onClick={() => handleSort('SouvenirName')}
              >
                <Button variant='ghost'>
                  Tên Quà Lưu Niệm
                  {sortField === 'SouvenirName' ? (
                    sortOrder === Sort.ASC ? (
                      <SortAsc />
                    ) : (
                      <SortDesc />
                    )
                  ) : (
                    <ArrowUpDown />
                  )}
                </Button>
              </TableHead>
              <TableHead
                className='cursor-pointer'
                onClick={() => handleSort('Price')}
              >
                <Button variant='ghost'>
                  Giá
                  {sortField === 'Price' ? (
                    sortOrder === Sort.ASC ? (
                      <SortAsc />
                    ) : (
                      <SortDesc />
                    )
                  ) : (
                    <ArrowUpDown />
                  )}
                </Button>
              </TableHead>
              <TableHead className='text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={6} rows={pageSize} />
            ) : souvenirs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='py-10 text-center'>
                  Không tìm thấy cửa hàng.{' '}
                  {isSearching && 'Hãy thử một từ khóa tìm kiếm khác.'}
                </TableCell>
              </TableRow>
            ) : (
              souvenirs.map((souvenir, index) => (
                <TableRow key={souvenir?.id || index}>
                  <TableCell className='text-muted-foreground'>
                    {index + 1 + (pageNumber - 1) * pageSize}
                  </TableCell>
                  <TableCell className='font-medium'>
                    {souvenir.souvenirName}
                  </TableCell>
                  <TableCell>{souvenir.price}</TableCell>
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
                          onClick={() => onViewSouvenir(souvenir.id || '')}
                        >
                          <Eye className='mr-2 h-4 w-4' />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEditSouvenir(souvenir.id || '')}
                        >
                          <FileEdit className='mr-2 h-4 w-4' />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className='text-destructive'
                          onClick={() => handleDeleteClick(souvenir.id || '')}
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
            Số dòng mỗi trang:
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
        description='Bạn có chắc chắn muốn xóa Quà Lưu Niệm này không? Hành động này không thể hoàn tác.'
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default SouvenirTable;
