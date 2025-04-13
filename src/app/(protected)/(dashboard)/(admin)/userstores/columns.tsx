'use client';

import { Button } from '@/components/ui/button';
import { Gender } from '@/enums/gender';
import { PATH } from '@/enums/path';
import { formateDateVi, formatSummaryAddress } from '@/lib/utils';
import { User } from '@/types/user-types';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'no',
    header: 'No.',
    cell: ({ row }) => {
      const index = row.index + 1;
      return <p className='text-muted-foreground'>{index}</p>;
    },
  },
  {
    accessorKey: 'userName',
    header: 'Tên đăng nhập',
  },
  {
    accessorKey: 'fullName',
    header: 'Họ và tên',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Số điện thoại',
  },

  {
    accessorKey: 'address',
    header: 'Địa chỉ',

    cell: ({ row }) => {
      const address = row.getValue('address') as string;
      if (!address) return '—';
      return formatSummaryAddress(address);
    },
  },
  {
    accessorKey: 'dob',
    header: 'Ngày sinh',
    cell: ({ row }) => {
      const dob = row.getValue('dob') as string;
      if (!dob) return '—';
      return formateDateVi(dob);
    },
  },
  {
    accessorKey: 'gender',
    header: 'Giới tính',
    cell: ({ row }) => {
      const gender = row.getValue('gender') as Gender;
      if (!gender) return '—';
      return gender;
    },
  },
  {
    id: 'actions',
    header: 'Thao tác',
    cell: ({ row }) => {
      const userStore = row.original;

      return (
        <div className='flex items-center gap-2'>
          <Link href={`${PATH.USER_STORES}/${userStore.id}`}>
            <Button>Tạo đơn</Button>
          </Link>
          <Link href={`${PATH.USER_STORES}/${userStore.id}`}>
            <Button variant={'outline'}>Xem đơn</Button>
          </Link>
        </div>
      );
    },
  },
];
