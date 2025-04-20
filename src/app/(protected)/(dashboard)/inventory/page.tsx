'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { STORAGE } from '@/constant/storage';
import {
  useInventoryBooksByStoreId,
  useInventorySouvenirsByStoreId,
} from '@/hooks/use-inventory';
import { getLocalStorageItem } from '@/utils/token';
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
          <DataTableBook columns={columnsBook} data={inventoriesByBook} />
        </TabsContent>
        <TabsContent value='souvenir'>
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
