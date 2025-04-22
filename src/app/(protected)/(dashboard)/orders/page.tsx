'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PaymentMethod, PaymentMethodLabel } from '@/enums/enums';
import { formatPrice } from '@/lib/utils';
import { Empty } from 'antd';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useOrderDetail } from './_lib/use-order-detail';

const Page = () => {
  const {
    orderDetailCarts,
    totalAmount,
    paymentMethod,
    handleIncrement,
    handleDecrement,
    handleQuantityChange,
    handleQuantityBlur,
    handleQuantityKeyDown,
    handleDelete,
    getCurrentQuantity,
    handleCreateOrder,
    setPaymentMethod,
    createOrderPending,
  } = useOrderDetail();

  return (
    <div className='container mx-auto py-8'>
      <h1 className='mb-6 text-2xl font-bold'>Thông Tin Đơn Hàng</h1>

      {orderDetailCarts && orderDetailCarts.length > 0 ? (
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
              {orderDetailCarts.map((item) => {
                const currentQuantity = getCurrentQuantity(
                  item.id,
                  item.quantity
                );

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
                    <TableCell>
                      <div className='flex items-center space-x-2'>
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() =>
                            handleDecrement(item.id, currentQuantity)
                          }
                          disabled={
                            currentQuantity === '' ||
                            Number(currentQuantity) <= 1
                          }
                        >
                          <Minus className='h-4 w-4' />
                        </Button>
                        <Input
                          type='text'
                          className='w-16 text-center'
                          value={currentQuantity}
                          onBlur={(e) =>
                            handleQuantityBlur(
                              item.id,
                              e.target.value,
                              item.quantity
                            )
                          }
                          onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                          }
                          onKeyDown={(e) =>
                            handleQuantityKeyDown(e, item.id, currentQuantity)
                          }
                        />
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() =>
                            handleIncrement(item.id, currentQuantity)
                          }
                        >
                          <Plus className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className='font-medium'>
                      {formatPrice(
                        item.price *
                          (currentQuantity === '' ? 0 : Number(currentQuantity))
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-red-500 hover:bg-red-50 hover:text-red-700'
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className='h-5 w-5' />
                      </Button>
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
                  {formatPrice(totalAmount)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      ) : (
        <div className='flex min-h-screen items-center justify-center'>
          <Empty description='Không có sản phẩm nào trong đơn hàng.' />
        </div>
      )}

      {orderDetailCarts && orderDetailCarts.length > 0 && (
        <div className='mt-8'>
          <div className='mb-4 flex items-center'>
            <h2 className='mb-2 text-lg font-semibold'>
              Phương thức thanh toán
            </h2>
            <RadioGroup
              value={paymentMethod || ''}
              onValueChange={(value) =>
                setPaymentMethod(value as PaymentMethod)
              }
              className='ml-4 flex items-center space-x-4'
            >
              <div className='mb-2 flex items-center space-x-2'>
                <RadioGroupItem value={PaymentMethod.CASH} id='payment-cash' />
                <Label htmlFor='payment-cash'>
                  {PaymentMethodLabel[PaymentMethod.CASH]}
                </Label>
              </div>

              <div className='flex items-center space-x-2'>
                <RadioGroupItem
                  value={PaymentMethod.TRANSFER}
                  id='payment-transfer'
                />
                <Label htmlFor='payment-transfer'>
                  {PaymentMethodLabel[PaymentMethod.TRANSFER]}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className='flex justify-end'>
            <Button onClick={handleCreateOrder} disabled={createOrderPending}>
              Tiến hành thanh toán
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
