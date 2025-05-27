'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PATH } from '@/enums/path';
import { Event } from '@/types/event-types';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { Eye, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EventStatusBadge from './event-status-badge';

type Props = {
  data: Event[];
};

const EventHistoryTableVersion = ({ data }: Props) => {
  const router = useRouter();

  // !FIX: Provide default empty array if data is undefined/null
  const safeData = data || [];

  const handleViewDetail = (eventId: string) => {
    router.push(`${PATH.EVENT_CREATION_HISTORY}/${eventId}`);
  };

  const columnHelper = createColumnHelper<Event>();

  const columns: ColumnDef<Event, any>[] = [
    columnHelper.accessor('eventName', {
      header: 'Tên sự kiện',
      cell: (info) => (
        <div className='max-w-xs'>
          <p className='truncate font-medium' title={info.getValue()}>
            {info.getValue()}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor('organizerEmail', {
      header: 'Email người tổ chức',
      cell: (info) => <span className='text-sm'>{info.getValue()}</span>,
    }),
    columnHelper.accessor('isApprove', {
      header: 'Trạng thái duyệt',
      cell: (info) => (
        <EventStatusBadge type='approve' value={info.getValue()} />
      ),
    }),
    columnHelper.accessor('isOpen', {
      header: 'Trạng thái mở',
      cell: (info) => <EventStatusBadge type='open' value={info.getValue()} />,
    }),
    columnHelper.accessor('totalRegistrations', {
      header: 'Số lượng đăng ký',
      cell: (info) => (
        <div className='flex items-center gap-1'>
          <Users className='h-4 w-4 text-muted-foreground' />
          <span>{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('version', {
      header: 'Phiên bản tạo',
      cell: (info) => {
        return <span className='text-sm'>{info.getValue()}</span>;
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Thao tác',
      cell: (info) => (
        <Button
          variant='outline'
          size='sm'
          onClick={() => handleViewDetail(info.row.original.id)}
        >
          <Eye className='h-4 w-4' />
        </Button>
      ),
    }),
  ];

  const table = useReactTable({
    data: safeData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventHistoryTableVersion;
