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
import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { useGetOrderById } from '@/hooks/use-order';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export default function OrderInfoPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { order } = useGetOrderById(params.orderId);
  useEntityBreadcrumb(PATH.ORDERS, 'Đơn hàng', params.orderId, order?.store);

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hình ảnh</TableHead>
            <TableHead>Tên sản phẩm</TableHead>
            <TableHead>Đơn giá</TableHead>
            <TableHead className='w-[200px]'>Số lượng</TableHead>
            <TableHead>Thành tiền</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order?.orderDetails.map((item) => {
            const itemTotal = item.price * item.quantity;
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div className='relative overflow-hidden'>
                    <Image
                      src={item.imgUrl}
                      alt={item.productName}
                      width={75}
                      height={100}
                      className='h-auto max-w-full'
                    />
                  </div>
                </TableCell>
                <TableCell className='font-medium'>
                  {item.productName}
                </TableCell>
                <TableCell>{formatPrice(item.price)}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell className='font-medium'>
                  {formatPrice(itemTotal)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className='text-right font-medium'>
              Tổng tiền đơn hàng:
            </TableCell>
            <TableCell className='text-lg font-bold text-primary'>
              {order && formatPrice(order.totalAmount)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
