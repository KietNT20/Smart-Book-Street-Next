'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { STORAGE } from '@/constant/storage';
import {
  useInventoryBooksByStoreId,
  useInventorySouvenirsByStoreId,
} from '@/hooks/use-inventory';
import { getLocalStorageItem } from '@/utils/token';
import ISBNScannerInventory from './_components/isbn-scan-inventory';
import { columnsBook } from './columns-book';
import { columnsSouvenir } from './columns-souvenir';
import { DataTableBook } from './data-table-book';
import { DataTableSouvenir } from './data-table-souvenir';

const InventoryPage = () => {
  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);
  const { inventoriesByBook } = useInventoryBooksByStoreId(storeId as string);
  const { inventoriesBySouvenir } = useInventorySouvenirsByStoreId(
    storeId as string
  );
  return (
    <div className='container mx-auto py-10'>
      <Tabs defaultValue='book' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='book'>Sách</TabsTrigger>
          <TabsTrigger value='souvenir'>Quà Lưu Niệm</TabsTrigger>
        </TabsList>
        <TabsContent value='book'>
          <div className='flex items-center justify-between py-4'>
            <h1 className='text-2xl font-bold'>Tồn kho sách</h1>
            <p className='text-sm text-muted-foreground'>
              Tổng số sách: {inventoriesByBook.length}
            </p>
          </div>
          <ISBNScannerInventory />
          <DataTableBook columns={columnsBook} data={inventoriesByBook} />
        </TabsContent>
        <TabsContent value='souvenir'>
          <div className='flex items-center justify-between py-4'>
            <h1 className='text-2xl font-bold'>Tồn kho quà lưu niệm</h1>
            <p className='text-sm text-muted-foreground'>
              Tổng số quà lưu niệm: {inventoriesBySouvenir.length}
            </p>
          </div>
          <DataTableSouvenir
            columns={columnsSouvenir}
            data={inventoriesBySouvenir}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryPage;
