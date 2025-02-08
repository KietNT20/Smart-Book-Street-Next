'use client';

import { Author } from '@/types/author-types';
import { ColumnDef } from '@tanstack/react-table';

type AuthorColumn = Omit<Author, 'id' | 'images'>;

export const columns: ColumnDef<AuthorColumn>[] = [
  {
    accessorKey: 'AuthorName',
    header: 'Tên tác giả',
  },
  {
    accessorKey: ' DOB',
    header: 'Ngày sinh',
  },
  {
    accessorKey: 'Nationality',
    header: 'Quốc tịch',
  },
  {
    accessorKey: 'Biography',
    header: 'Tiểu sử',
  },
  {
    id: 'actions',
    accessorKey: 'id',
    header: 'Hành động',
  },
];
