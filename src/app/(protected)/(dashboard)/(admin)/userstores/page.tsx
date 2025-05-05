import { getListUserRentals } from './action/user-stores';
import { columns } from './columns';
import { DataTable } from './data-table';

export default async function UserStoresPage() {
  const data = await getListUserRentals();
  return (
    <div className='container mx-auto'>
      <h2 className='text-3xl font-bold'>Quản lý người thuê</h2>
      <DataTable columns={columns} data={data.results || []} />
    </div>
  );
}
