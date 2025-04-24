import { ConfirmModal } from '@/components/confirm-modal';
import TablePagination from '@/components/pagination/table-pagination';
import { TableSkeleton } from '@/components/table-skeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { STORAGE } from '@/constant/storage';
import { Sort } from '@/enums/enums';
import { PATH } from '@/enums/path';
import { useInventoryMutation } from '@/hooks/use-inventory';
import { useSouvenirMutation } from '@/hooks/use-souvenir';
import { formatPrice } from '@/lib/utils';
import { Souvenir } from '@/types/souvenir-types';
import { getLocalStorageItem } from '@/utils/token';
import { DialogTitle } from '@radix-ui/react-dialog';
import {
  ArrowUpDown,
  FileEdit,
  MoreHorizontal,
  PackagePlus,
  SortAsc,
  SortDesc,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

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
}: Props) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [souvenirToDelete, setSouvenirToDelete] = useState<string | null>(null);

  // State để quản lý dialog cho từng sản phẩm
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  const { deleteSouvenir } = useSouvenirMutation();
  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY) as string;
  const { addProductToStore } = useInventoryMutation();

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

  // Hàm mở dialog và khởi tạo quantity nếu chưa có
  const handleOpenDialog = (souvenirId: string) => {
    if (!quantities[souvenirId]) {
      setQuantities((prev) => ({ ...prev, [souvenirId]: '0' }));
    }
    setOpenDialog(souvenirId);
  };

  // Hàm cập nhật quantity cho từng sản phẩm
  const handleQuantityChange = (souvenirId: string, value: string) => {
    setQuantities((prev) => ({ ...prev, [souvenirId]: value }));
  };

  const handleAddToStore = (souvenirId: string) => {
    const quantity = quantities[souvenirId] || '0';

    if (!quantity || !/^\d+$/.test(quantity)) {
      toast.error('Vui lòng nhập số hợp lệ');
      return;
    }

    const quantityValue = parseInt(quantity);

    if (quantityValue < 0) {
      toast.error('Số lượng không thể âm');
      return;
    }

    toast.promise(
      addProductToStore.mutateAsync({
        entityId: souvenirId,
        storeId: storeId,
        isInStock: true,
        quantity: quantityValue,
      }),
      {
        loading: 'Đang thêm vào kho của bạn...',
        success: () => {
          setOpenDialog(null);
          return 'Thêm vào kho thành công';
        },
        error: 'Sản phẩm đã tồn tại trong kho',
      }
    );
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
              souvenirs.map((souvenir, index) => {
                const souvenirId = souvenir.id || '';
                return (
                  <TableRow key={souvenirId || index}>
                    <TableCell className='text-muted-foreground'>
                      {index + 1 + (pageNumber - 1) * pageSize}
                    </TableCell>
                    <TableCell className='font-medium'>
                      {souvenir.souvenirName}
                    </TableCell>
                    <TableCell>{formatPrice(souvenir.price)}</TableCell>
                    <TableCell className='text-right'>
                      <Dialog
                        open={openDialog === souvenirId}
                        onOpenChange={(open) =>
                          open
                            ? handleOpenDialog(souvenirId)
                            : setOpenDialog(null)
                        }
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem
                              className='cursor-pointer'
                              asChild
                            >
                              <Link href={`${PATH.SOUVENIRS}/${souvenirId}`}>
                                <FileEdit className='mr-2 h-4 w-4' />
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='text-destructive'
                              onClick={() => handleDeleteClick(souvenirId)}
                            >
                              <Trash2 className='mr-2 h-4 w-4' />
                              Xóa
                            </DropdownMenuItem>
                            <DialogTrigger asChild>
                              <DropdownMenuItem>
                                <PackagePlus className='mr-2 h-4 w-4' />
                                <span>Thêm vào kho</span>
                              </DropdownMenuItem>
                            </DialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Thêm sản phẩm vào kho</DialogTitle>
                            <DialogDescription>
                              Nhập số lượng sản phẩm bạn muốn thêm vào kho
                            </DialogDescription>
                          </DialogHeader>
                          <div className='py-4'>
                            <Label
                              htmlFor={`quantity-${souvenirId}`}
                              className='mb-2 block'
                            >
                              Số lượng
                            </Label>
                            <Input
                              id={`quantity-${souvenirId}`}
                              type='text'
                              value={quantities[souvenirId] || '0'}
                              onChange={(e) =>
                                handleQuantityChange(souvenirId, e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (
                                  !/^\d$/.test(e.key) &&
                                  e.key !== 'Backspace' &&
                                  e.key !== 'Enter' &&
                                  e.key !== 'Tab' &&
                                  e.key !== 'ArrowLeft' &&
                                  e.key !== 'ArrowRight'
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              placeholder='Nhập số lượng'
                              className='w-full'
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              variant='outline'
                              onClick={() => setOpenDialog(null)}
                            >
                              Hủy
                            </Button>
                            <Button
                              type='button'
                              onClick={() => handleAddToStore(souvenirId)}
                            >
                              Xác nhận thêm vào kho
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })
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
