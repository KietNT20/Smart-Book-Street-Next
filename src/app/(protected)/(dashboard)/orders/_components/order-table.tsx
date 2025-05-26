'use client';

import TablePagination from '@/components/pagination/table-pagination';
import { TableSkeleton } from '@/components/table-skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  OrderStatus,
  OrderStatusLabel,
  PaymentMethod,
  PaymentMethodLabel,
  Sort,
} from '@/enums/enums';
import { PATH } from '@/enums/path';
import { formatPrice } from '@/lib/utils';
import dayjs from 'dayjs';
import {
  ArrowUpDown,
  CheckCircle,
  Eye,
  MoreHorizontal,
  SortAsc,
  SortDesc,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useOrderTable } from '../_hooks/use-order-table';
import OrderFilter from './order-filter';

const OrderTable = () => {
  const {
    orders,
    ordersLoading,
    totalPage,
    pageNumber,
    pageSize,
    sortField,
    sortOrder,
    isSearching,
    handleSort,
    handleFilterChange,
    handlePageSizeChange,
    handleUpdateOrderStatus,
    handleCancelOrderStatus,
    getStatusColor,
    setPageNumber,
    storeId,
    isOrderCancelPending,
    updateOrderStatusPending,
  } = useOrderTable();

  return (
    <div className='space-y-4'>
      {/* Filter Component */}
      <OrderFilter
        onFilterChange={handleFilterChange}
        initialStoreId={storeId}
      />

      {/* Table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead
                className='cursor-pointer'
                onClick={() => handleSort('totalAmount')}
              >
                <Button variant='ghost'>
                  Số tiền
                  {sortField === 'totalAmount' ? (
                    sortOrder === Sort.ASC ? (
                      <SortAsc className='ml-2 size-4' />
                    ) : (
                      <SortDesc className='ml-2 size-4' />
                    )
                  ) : (
                    <ArrowUpDown className='ml-2 size-4' />
                  )}
                </Button>
              </TableHead>
              <TableHead
                className='cursor-pointer'
                onClick={() => handleSort('paymentMethod')}
              >
                <Button variant='ghost'>
                  Phương thức thanh toán
                  {sortField === 'paymentMethod' ? (
                    sortOrder === Sort.ASC ? (
                      <SortAsc className='ml-2 size-4' />
                    ) : (
                      <SortDesc className='ml-2 size-4' />
                    )
                  ) : (
                    <ArrowUpDown className='ml-2 size-4' />
                  )}
                </Button>
              </TableHead>
              <TableHead
                className='cursor-pointer'
                onClick={() => handleSort('status')}
              >
                <Button variant='ghost'>
                  Tình trạng
                  {sortField === 'status' ? (
                    sortOrder === Sort.ASC ? (
                      <SortAsc className='ml-2 size-4' />
                    ) : (
                      <SortDesc className='ml-2 size-4' />
                    )
                  ) : (
                    <ArrowUpDown className='ml-2 size-4' />
                  )}
                </Button>
              </TableHead>
              <TableHead
                className='cursor-pointer'
                onClick={() => handleSort('createdDate')}
              >
                <Button variant='ghost'>
                  Ngày tạo
                  {sortField === 'createdDate' ? (
                    sortOrder === Sort.ASC ? (
                      <SortAsc className='ml-2 size-4' />
                    ) : (
                      <SortDesc className='ml-2 size-4' />
                    )
                  ) : (
                    <ArrowUpDown className='ml-2 size-4' />
                  )}
                </Button>
              </TableHead>
              <TableHead className='text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersLoading ? (
              <TableSkeleton columns={7} rows={pageSize} />
            ) : orders && orders.length > 0 ? (
              orders.map((order, index) => (
                <TableRow key={order.id}>
                  <TableCell className='text-muted-foreground'>
                    {index + 1 + (pageNumber - 1) * pageSize}
                  </TableCell>
                  <TableCell>{formatPrice(order?.totalAmount)}</TableCell>
                  <TableCell>
                    {PaymentMethodLabel[
                      order?.paymentMethod as PaymentMethod
                    ] || order?.paymentMethod}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant='outline'
                      className={getStatusColor(order?.status)}
                    >
                      {OrderStatusLabel[order?.status as OrderStatus] ||
                        order?.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {dayjs(new Date(order?.createdDate)).format(
                      'DD/MM/YYYY HH:mm'
                    )}
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreHorizontal className='size-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem asChild className='cursor-pointer'>
                          <Link href={`${PATH.ORDERS}/${order?.id}`}>
                            <Eye className='mr-2 size-4' />
                            Xem chi tiết
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {order?.status !== OrderStatus.COMPLETED && (
                          <DropdownMenuItem
                            onClick={() => handleUpdateOrderStatus(order?.id)}
                            disabled={updateOrderStatusPending}
                            className='cursor-pointer'
                          >
                            <CheckCircle className='mr-2 size-4 text-green-600' />
                            Hoàn thành đơn hàng
                          </DropdownMenuItem>
                        )}
                        {order?.status === OrderStatus.IN_PROGRESS && (
                          <DropdownMenuItem
                            onClick={() => handleCancelOrderStatus(order?.id)}
                            disabled={isOrderCancelPending}
                            className='cursor-pointer'
                          >
                            <XCircle className='mr-2 size-4 text-red-600' />
                            Hủy đơn hàng
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='py-10 text-center text-muted-foreground'
                >
                  Không tìm thấy đơn hàng.{' '}
                  {isSearching && 'Hãy thử thay đổi bộ lọc.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination and page size controls */}
      <div className='mt-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='whitespace-nowrap text-sm text-muted-foreground'>
            Số dòng:
          </span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className='h-8 w-16'>
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='30'>30</SelectItem>
              <SelectItem value='40'>40</SelectItem>
              <SelectItem value='50'>50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TablePagination
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          totalPages={totalPage || 1}
        />
      </div>
    </div>
  );
};

export default OrderTable;
