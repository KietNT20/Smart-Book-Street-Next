'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PATH } from '@/enums/path';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export type Event = {
  id: string;
  eventName: string;
  startDate: Date | string;
  endDate: Date | string;
};

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: 'no',
    header: 'No.',
    cell: ({ row }) => {
      const index = row.index + 1;
      return <p className='text-muted-foreground'>{index}</p>;
    },
  },
  {
    accessorKey: 'eventName',
    header: 'Sự Kiện',
  },
  {
    accessorKey: 'startDate',
    header: 'Ngày Bắt Đầu',
    cell: ({ row }) => {
      const event = row.original;
      return <p>{dayjs(event.startDate).format('DD/MM/YYYY - HH:mm A')}</p>;
    },
  },
  {
    accessorKey: 'endDate',
    header: 'Ngày Kết Thúc',
    cell: ({ row }) => {
      const event = row.original;
      return <p>{dayjs(event.endDate).format('DD/MM/YYYY - HH:mm A')}</p>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const event = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='size-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link href={`${PATH.EVENT_DATE}/${event.id}`}>Điểm danh</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
