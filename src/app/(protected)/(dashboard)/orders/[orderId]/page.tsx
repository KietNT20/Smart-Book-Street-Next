'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetOrderById } from '@/hooks/use-order';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export default function OrderInfoPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { order } = useGetOrderById(params.orderId);
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[80px]'>Hình ảnh</TableHead>
            <TableHead>Tên sản phẩm</TableHead>
            <TableHead>Đơn giá</TableHead>
            <TableHead className='w-[200px]'>Số lượng</TableHead>
            <TableHead>Thành tiền</TableHead>
            <TableHead className='w-[80px]'>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order?.orderDetails.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div className='relative h-20 w-20 overflow-hidden rounded-md'>
                    <Image
                      src={item.imgUrl}
                      alt={item.productName}
                      fill
                      className='object-cover'
                    />
                  </div>
                </TableCell>
                <TableCell className='font-medium'>
                  {item.productName}
                </TableCell>
                <TableCell>{formatPrice(item.price)}</TableCell>
                <TableCell></TableCell>
                <TableCell className='font-medium'></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className='text-right font-medium'>
              Tổng tiền đơn hàng:
            </TableCell>
            <TableCell className='text-lg font-bold text-primary'></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
