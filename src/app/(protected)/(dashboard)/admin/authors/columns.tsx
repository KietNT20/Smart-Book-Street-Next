'use client';

import { formateDateVi } from '@/lib/utils';
import { Author } from '@/types/author-types';
import { ColumnDef } from '@tanstack/react-table';
import AuthorMenuAction from './_components/author-menu-action';

export const columns: ColumnDef<Author>[] = [
  {
    accessorKey: 'authorName',
    header: 'Tên tác giả'
  },
  {
    accessorKey: 'dob',
    header: 'Ngày sinh',
    cell: ({ row }) => {
      const date = row.getValue('dob') as string | Date;
      if (!date) return 'Chưa có thông tin';
      return formateDateVi(date);
    }
  },
  {
    accessorKey: 'nationality',
    header: 'Quốc tịch'
  },
  {
    accessorKey: 'biography',
    header: 'Tiểu sử',
    cell: ({ row }) => {
      const bio = row.getValue('biography') as string;
      return bio?.length > 50 ? `${bio.substring(0, 50)}...` : bio;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const author = row.original;
      const authorProps = { author };

      return <AuthorMenuAction {...authorProps} />;
    }
  }
];
