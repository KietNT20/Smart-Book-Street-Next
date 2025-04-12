'use client';

import { useUsers } from '@/hooks/use-user';
import { columns } from './columns';
import { DataTable } from './data-table';

export default function UserStoresPage() {
  const { users } = useUsers();

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={users} />
    </div>
  );
}
