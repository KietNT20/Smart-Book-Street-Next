'use client';

import { Button } from '@/components/ui/button';
import { PATH } from '@/enums/path';
import { formateDateVi, formatSummaryAddress } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { UserRentals } from './action/user-stores';

export const columns: ColumnDef<UserRentals>[] = [
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
    id: 'actions',
    header: 'Thao tác',
    cell: ({ row }) => {
      const userStore = row.original;
      return (
        <div className='flex items-center gap-2'>
          <Button variant={'darker'}>
            <Link href={`${PATH.USER_STORES}/${userStore.id}`} passHref>
              Tạo đơn
            </Link>
          </Button>
          <Button variant={'outline'} disabled={!userStore.hasRental}>
            <Link
              href={`${PATH.USER_STORES}/${userStore.id}/registered`}
              passHref
            >
              {userStore.hasRental ? 'Xem đơn' : 'Chưa đăng ký'}
            </Link>
          </Button>
        </div>
      );
    },
  },
];
