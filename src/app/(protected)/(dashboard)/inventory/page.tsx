'use client';

import { STORAGE } from '@/constant/storage';
import { useInventoryByStoreId } from '@/hooks/use-inventory';
import { columns } from './columns';
import { DataTable } from './data-table';

const InventoryPage = () => {
  const storeId = localStorage.getItem(STORAGE.SELECTED_STORE_KEY);
  const { inventoriesByStoreId } = useInventoryByStoreId(storeId as string);
  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={inventoriesByStoreId} />
    </div>
  );
};

export default InventoryPage;
