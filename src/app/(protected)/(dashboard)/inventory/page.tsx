'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PATH } from '@/enums/path';
import {
  useInventoryBooksByStoreId,
  useInventorySouvenirsByStoreId,
} from '@/hooks/use-inventory';
import { useOrderDetailCarts } from '@/hooks/use-order-detail';
import { Badge } from 'antd';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import ISBNScannerInventory from './_components/isbn-scan-inventory';
import { columnsBook } from './columns-book';
import { columnsSouvenir } from './columns-souvenir';
import { DataTableBook } from './data-table-book';
import { DataTableSouvenir } from './data-table-souvenir';

const InventoryPage = () => {
  const { inventoriesByBook } = useInventoryBooksByStoreId();
  const { inventoriesBySouvenir } = useInventorySouvenirsByStoreId();
  const { totalItem } = useOrderDetailCarts();

  return (
    <div className='container relative mx-auto py-10'>
      <div className='mb-4 flex items-center justify-end px-3'>
        {' '}
        <Link href={PATH.ORDERS}>
          <Badge count={totalItem}>
            <Button>
              <ShoppingCart className='mr-2 h-4 w-4' /> Đơn hàng
            </Button>
          </Badge>
        </Link>
      </div>
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
