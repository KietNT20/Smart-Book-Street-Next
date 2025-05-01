'use client';

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
  DialogTitle,
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
import { Language, VietnameseLanguageLabels } from '@/enums/lang';
import { PATH } from '@/enums/path';
import { useBookMutations } from '@/hooks/use-books';
import { useInventoryMutation } from '@/hooks/use-inventory';
import { formateDateVi, formatPrice } from '@/lib/utils';
import { Book } from '@/types/book-types';
import { getLocalStorageItem } from '@/utils/token';
import {
  ArrowUpDown,
  Edit,
  Eye,
  MoreHorizontal,
  PackagePlus,
  SortAsc,
  SortDesc,
  Trash,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  books: Book[];
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

const BookTable = ({
  books,
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
  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const { deleteBook } = useBookMutations();

  // Add to store state
  const [addToStoreDialogOpen, setAddToStoreDialogOpen] = useState(false);
  const [bookToAddToStore, setBookToAddToStore] = useState<Book | null>(null);
  const [quantity, setQuantity] = useState('0');
  const { addProductToStore } = useInventoryMutation();
  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY) as string;

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setPageNumber(1); // Reset to first page when changing page size
  };

  // Handle opening delete dialog
  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (bookToDelete?.id) {
      deleteBook(bookToDelete.id);
      setDeleteDialogOpen(false);
      setBookToDelete(null);
    }
  };

  // Handle opening add to store dialog
  const handleAddToStoreClick = (book: Book) => {
    setBookToAddToStore(book);
    setQuantity('0');
    setAddToStoreDialogOpen(true);
  };

  // Handle add to store confirmation
  const handleAddToStore = () => {
    if (!bookToAddToStore?.id) return;

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
        entityId: bookToAddToStore.id,
        storeId: storeId,
        isInStock: true,
        quantity: quantityValue,
      }),
      {
        loading: 'Đang thêm vào kho của bạn...',
        success: () => {
          return 'Thêm vào kho thành công';
        },
        error: 'Sản phẩm đã tồn tại trong kho',
      }
    );
    setAddToStoreDialogOpen(false);
    setBookToAddToStore(null);
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
                onClick={() => handleSort('ISBN')}
              >
                <Button variant='ghost'>
                  ISBN
                  {sortField === 'ISBN' ? (
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
                onClick={() => handleSort('Title')}
              >
                <Button variant='ghost'>
                  Tiêu đề
                  {sortField === 'Title' ? (
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
                onClick={() => handleSort('Languages')}
              >
                <Button variant='ghost'>
                  Ngôn ngữ
                  {sortField === 'Languages' ? (
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
                onClick={() => handleSort('PublicationDate')}
              >
                <Button variant='ghost'>
                  Ngày xuất bản
                  {sortField === 'PublicationDate' ? (
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
                onClick={() => handleSort('Price')}
              >
                <Button variant='ghost'>
                  Giá
                  {sortField === 'Price' ? (
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
              <TableHead className='text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={7} rows={pageSize} />
            ) : books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='py-10 text-center'>
                  Không tìm thấy sách.{' '}
                  {isSearching && 'Hãy thử một từ khóa tìm kiếm khác.'}
                </TableCell>
              </TableRow>
            ) : (
              books.map((book, index) => (
                <TableRow key={book.id}>
                  <TableCell className='text-muted-foreground'>
                    {index + 1 + (pageNumber - 1) * pageSize}
                  </TableCell>
                  <TableCell className='font-medium'>{book.isbn}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>
                    {VietnameseLanguageLabels[book.languages as Language]}
                  </TableCell>
                  <TableCell>{formateDateVi(book.publicationDate)}</TableCell>
                  <TableCell>{formatPrice(book.price)}</TableCell>
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
                          <Link href={`${PATH.BOOKS}/${book.id}`}>
                            <Eye className='mr-2 h-4 w-4' />
                            Xem chi tiết
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild className='cursor-pointer'>
                          <Link href={`${PATH.BOOKS}/${book.id}/edit`}>
                            <Edit className='mr-2 h-4 w-4' />
                            Chỉnh sửa
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className='cursor-pointer text-destructive'
                          onClick={() => handleDeleteClick(book)}
                        >
                          <Trash className='mr-2 h-4 w-4' />
                          Xóa
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className='cursor-pointer'
                          onClick={() => handleAddToStoreClick(book)}
                        >
                          <PackagePlus className='mr-2 h-4 w-4' />
                          Thêm vào kho
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
          totalPages={totalPages}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        variant='destructive'
        title='Xác nhận xóa'
        description={`Bạn có chắc chắn muốn xóa sách "${bookToDelete?.title}" không? Hành động này không thể hoàn tác.`}
        onConfirm={handleDeleteConfirm}
        confirmText='Xác nhận xóa'
      />

      {/* Add to Store Dialog */}
      <Dialog
        open={addToStoreDialogOpen}
        onOpenChange={setAddToStoreDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm sản phẩm vào kho</DialogTitle>
            <DialogDescription>
              Nhập số lượng sản phẩm bạn muốn thêm vào kho
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <Label htmlFor='quantity' className='mb-2 block'>
              Số lượng
            </Label>
            <Input
              id='quantity'
              type='text'
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
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
              onClick={() => setAddToStoreDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button type='button' onClick={handleAddToStore}>
              Xác nhận thêm vào kho
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookTable;
