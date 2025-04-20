'use client';

import { STORAGE } from '@/constant/storage';
import { useInventoryBooksByStoreId } from '@/hooks/use-inventory';
import { getLocalStorageItem } from '@/utils/token';
import { columns } from './columns';
import { DataTable } from './data-table';

const InventoryPage = () => {
  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);
  const { inventoriesByStoreId } = useInventoryBooksByStoreId(
    storeId as string
  );
  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={inventoriesByStoreId} />
    </div>
  );
};

export default InventoryPage;
