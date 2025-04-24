'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrderTablePayment from './_components/order-table-payment';

const Page = () => {
  return (
    <div className='container mx-auto py-8'>
      <h1 className='mb-6 text-2xl font-bold'>Thông Tin Đơn Hàng</h1>
      <Tabs defaultValue='order_pending' className='w-full'>
        <TabsList className='mb-4 grid w-full grid-cols-2'>
          <TabsTrigger value='order_pending'>Đang Chờ</TabsTrigger>
          <TabsTrigger value='order_history'>Lịch Sử Đơn</TabsTrigger>
        </TabsList>
        <TabsContent value='order_pending'>
          <OrderTablePayment />
        </TabsContent>
        <TabsContent value='order_history'>
          Your order history will be displayed here.
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
