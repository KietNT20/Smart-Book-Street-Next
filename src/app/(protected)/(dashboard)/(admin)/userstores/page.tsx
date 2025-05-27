'use client';

import LoadingSpinner from '@/components/spin/loading-spinner';
import { useListUserRentals } from './action/user-stores';
import { columns } from './columns';
import { DataTable } from './data-table';

export default function UserStoresPage() {
  const { userRentals, isLoadingUserRentals } = useListUserRentals();

  if (isLoadingUserRentals) {
    return <LoadingSpinner />;
  }
  return (
    <div className='container mx-auto'>
      <h2>Quản lý người thuê</h2>
      <DataTable columns={columns} data={userRentals} />
    </div>
  );
}
