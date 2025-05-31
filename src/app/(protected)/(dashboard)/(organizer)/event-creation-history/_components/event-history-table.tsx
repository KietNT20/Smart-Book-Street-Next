import TablePagination from '@/components/pagination/table-pagination';
import { TableSkeleton } from '@/components/table-skeleton';
import { Button } from '@/components/ui/button';
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
import { formatDateVi } from '@/lib/utils';
import { Event } from '@/types/event-types';
import { Empty } from 'antd';
import { ArrowUpDown, Eye, SortAsc, SortDesc } from 'lucide-react';
import Link from 'next/link';
import EventStatusBadge from './event-status-badge';

type Props = {
  events: Event[];
  isLoading: boolean;
  totalPages: number;
  pageNumber: number;
  setPageNumber: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  sortField: string;
  sortOrder: Sort;
  handleSort: (field: string) => void;
};

export default function EventHistoryTable({
  events,
  isLoading,
  totalPages,
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
  sortField,
  sortOrder,
  handleSort,
}: Props) {
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setPageNumber(1);
  };

  const showEmptyState = !isLoading && (!events || events.length === 0);

  return (
    <>
      <div className='rounded-md border'>
        <Table className='table-auto'>
          <TableHeader>
            <TableRow>
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
                onClick={() => handleSort('OrganizerEmail')}
              >
                <Button variant='ghost'>
                  Email đăng ký
                  {sortField === 'OrganizerEmail' ? (
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
                  Khu vực tổ chức
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
              <TableHead>Phiên bản</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className='text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={7} rows={pageSize} />
            ) : events && events.length > 0 ? (
              events.map((event, index) => (
                <TableRow key={event?.id || index}>
                  <TableCell className='text-sm font-medium'>
                    {event?.eventName}
                  </TableCell>
                  <TableCell className='text-sm font-medium'>
                    {event?.organizerEmail || '--'}
                  </TableCell>
                  <TableCell className='text-sm'>
                    {formatDateVi(event?.startDate)}
                  </TableCell>
                  <TableCell className='text-sm'>
                    {formatDateVi(event?.endDate)}
                  </TableCell>
                  <TableCell className='max-w-52 overflow-hidden text-ellipsis whitespace-nowrap text-sm'>
                    {event?.zone?.zoneName}
                  </TableCell>
                  <TableCell className='text-sm'>{event?.version}</TableCell>
                  <TableCell className='w-36'>
                    <EventStatusBadge
                      type='approve'
                      value={event?.isApprove}
                      message={event?.message ? event.message : undefined}
                    />
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button size={'icon'}>
                      <Link
                        href={`${PATH.EVENT_CREATION_HISTORY}/${event?.id}`}
                      >
                        <Eye className='size-4' />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className='h-64 p-0 text-center'>
                  <div className='flex h-full w-full items-center justify-center'>
                    <Empty description='Không có yêu cầu sự kiện nào được tìm thấy.' />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
    </>
  );
}
