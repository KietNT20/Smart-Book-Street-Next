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
import { PATH } from '@/enums/path';
import { useEventMutaton } from '@/hooks/use-event';
import { formatDateVi } from '@/lib/utils';
import { Event } from '@/types/event-types';
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
  events: Event[];
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

const EventTable = ({
  events,
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const showEmptyState = !isLoading && (!events || events.length === 0);
  const { deleteEvent } = useEventMutaton();

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setPageNumber(1);
  };

  // Handle opening delete dialog
  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete);

      setDeleteDialogOpen(false);
      setEventToDelete(null);
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
                onClick={() => handleSort('EventName')}
              >
                <Button variant='ghost'>
                  Tên Sự Kiện
                  {sortField === 'EventName' ? (
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
                onClick={() => handleSort('StartDate')}
              >
                <Button variant='ghost'>
                  Ngày bắt đầu
                  {sortField === 'StartDate' ? (
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
                onClick={() => handleSort('EndDate')}
              >
                <Button variant='ghost'>
                  Ngày kết thúc
                  {sortField === 'EndDate' ? (
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
                onClick={() => handleSort('Zone')}
              >
                <Button variant='ghost'>
                  Khu vực
                  {sortField === 'Zone' ? (
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
            ) : events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='py-10 text-center'>
                  Không tìm thấy sự kiện.{' '}
                  {isSearching && 'Hãy thử một từ khóa tìm kiếm khác.'}
                </TableCell>
              </TableRow>
            ) : (
              events?.map((event, index) => (
                <TableRow key={event?.id}>
                  <TableCell className='text-muted-foreground'>
                    {index + 1 + (pageNumber - 1) * pageSize}
                  </TableCell>
                  <TableCell className='font-medium'>
                    {event?.eventName}
                  </TableCell>
                  <TableCell>{formatDateVi(event?.startDate)}</TableCell>
                  <TableCell>{formatDateVi(event?.endDate)}</TableCell>
                  <TableCell className='max-w-52 overflow-hidden text-ellipsis whitespace-nowrap'>
                    {event?.zone?.zoneName}
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreHorizontal className='size-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem asChild className='cursor-pointer'>
                          <Link href={`${PATH.EVENTS}/${event?.id}`}>
                            <Eye className='mr-2 size-4' />
                            Xem chi tiết
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className='text-destructive'
                          onClick={() => handleDeleteClick(event?.id || '')}
                        >
                          <Trash2 className='mr-2 size-4' />
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
      {!showEmptyState && (
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

          <TablePagination
            totalPages={totalPages}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        variant='destructive'
        title='Xác nhận xóa'
        description='Bạn có chắc chắn muốn xóa Sự Kiện này không? Hành động này không thể hoàn tác.'
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default EventTable;
