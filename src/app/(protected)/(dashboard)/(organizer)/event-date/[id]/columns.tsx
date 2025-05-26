'use client';

import { ColumnDef } from '@tanstack/react-table';
import CheckedInput from './_components/checked-input';

export type UserSignEvent = {
  id: string;
  registrantName: string;
  registrantEmail: string;
  registrantPhoneNumber: string;
  isAttended: boolean;
};

export const columns: ColumnDef<UserSignEvent>[] = [
  {
    accessorKey: 'no',
    header: 'No.',
    cell: ({ row }) => {
      const index = row.index + 1;
      return <p className='text-muted-foreground'>{index}</p>;
    },
  },
  {
    accessorKey: 'registrantName',
    header: 'Người Đăng Ký',
  },
  {
    accessorKey: 'registrantEmail',
    header: 'Email Đăng Ký',
  },
  {
    accessorKey: 'registrantPhoneNumber',
    header: 'Số Điện Thoại Đăng Ký',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const event = row.original;

      return <CheckedInput user={event} />;
    },
  },
];
