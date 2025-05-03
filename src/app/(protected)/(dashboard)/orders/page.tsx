'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrderTable from './_components/order-table';
import OrderTablePayment from './_components/order-table-payment';

const Page = () => {
  return (
    <div className='container mx-auto'>
      <h1 className='mb-6 text-2xl font-bold'>Thông Tin Đơn Hàng</h1>
      <Tabs defaultValue='order_history' className='w-full'>
        <TabsList className='mb-4 grid w-full grid-cols-2'>
          <TabsTrigger value='order_history'>Quản Lý Đơn</TabsTrigger>
          <TabsTrigger value='order_pending'>Đang Chờ</TabsTrigger>
        </TabsList>
        <TabsContent value='order_history'>
          <OrderTable />
        </TabsContent>
        <TabsContent value='order_pending'>
          <OrderTablePayment />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
