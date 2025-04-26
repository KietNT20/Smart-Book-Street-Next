'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { STORAGE } from '@/constant/storage';
import {
  OrderStatus,
  OrderStatusLabel,
  PaymentMethod,
  PaymentMethodLabel,
} from '@/enums/enums';
import useDebounce from '@/hooks/use-debounce';
import { OrderParamsResult } from '@/types/order-types';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
dayjs.locale('vi');

interface OrderFilterProps {
  onFilterChange: (filterValues: OrderParamsResult) => void;
  initialStoreId?: string;
}

type FilterState = {
  storeId: string;
  minAmount: string;
  maxAmount: string;
  paymentMethod: PaymentMethod | typeof ALL_VALUE;
  status: OrderStatus | typeof ALL_VALUE;
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
};

type FilterValue<K extends keyof FilterState> = FilterState[K];

type FilterChangeFunction = (filterValues: OrderParamsResult) => void;

const ALL_VALUE = 'all';

const OrderFilter = ({ onFilterChange, initialStoreId }: OrderFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const prevPropsRef = useRef<{
    onFilterChange?: FilterChangeFunction;
    initialStoreId?: string;
  }>({});

  const [filters, setFilters] = useState<FilterState>({
    storeId: initialStoreId || '',
    minAmount: '',
    maxAmount: '',
    paymentMethod: ALL_VALUE,
    status: ALL_VALUE,
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    prevPropsRef.current = { onFilterChange, initialStoreId };
  });

  const isFiltering =
    filters.minAmount !== '' ||
    filters.maxAmount !== '' ||
    filters.paymentMethod !== ALL_VALUE ||
    filters.status !== ALL_VALUE ||
    filters.startDate !== null ||
    filters.endDate !== null;

  useEffect(() => {
    if (initialStoreId !== prevPropsRef.current.initialStoreId) {
      if (initialStoreId) {
        setFilters((prev) => ({ ...prev, storeId: initialStoreId }));
      } else {
        const storedStoreId = localStorage.getItem(STORAGE.SELECTED_STORE_KEY);
        if (storedStoreId) {
          setFilters((prev) => ({ ...prev, storeId: storedStoreId }));
        }
      }
    }
  }, [initialStoreId]);

  const debouncedFilters = useDebounce(filters, 700);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const filterValues: OrderParamsResult = {
      storeId: debouncedFilters.storeId || '',
    };

    if (debouncedFilters.minAmount) {
      filterValues.minAmount = Number(debouncedFilters.minAmount);
    }

    if (debouncedFilters.maxAmount) {
      filterValues.maxAmount = Number(debouncedFilters.maxAmount);
    }

    if (
      debouncedFilters.paymentMethod &&
      debouncedFilters.paymentMethod !== ALL_VALUE
    ) {
      filterValues.paymentMethod =
        debouncedFilters.paymentMethod as PaymentMethod;
    }

    if (debouncedFilters.status && debouncedFilters.status !== ALL_VALUE) {
      filterValues.status = debouncedFilters.status as OrderStatus;
    }

    if (debouncedFilters.startDate) {
      filterValues.startDate = debouncedFilters.startDate.toDate();
    }

    if (debouncedFilters.endDate) {
      filterValues.endDate = debouncedFilters.endDate.toDate();
    }

    onFilterChange(filterValues);
  }, [debouncedFilters, onFilterChange]);

  const handleInputChange = <K extends keyof FilterState>(
    field: K,
    value: FilterValue<K>
  ): void => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearField = (field: keyof typeof filters): void => {
    if (field === 'startDate' || field === 'endDate') {
      setFilters((prev) => ({ ...prev, [field]: null }));
    } else if (field === 'paymentMethod' || field === 'status') {
      setFilters((prev) => ({ ...prev, [field]: ALL_VALUE }));
    } else {
      setFilters((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const clearAllFilters = (): void => {
    setFilters({
      storeId: filters.storeId,
      minAmount: '',
      maxAmount: '',
      paymentMethod: ALL_VALUE,
      status: ALL_VALUE,
      startDate: null,
      endDate: null,
    });
  };

  return (
    <Card className='mb-6'>
      <CardContent className='p-3 pt-3'>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className='flex items-center justify-end gap-2'>
            {isFiltering && (
              <Button variant='outline' onClick={clearAllFilters} size='sm'>
                Xóa bộ lọc
              </Button>
            )}
            <CollapsibleTrigger asChild>
              <Button variant='outline' size='sm'>
                Bộ lọc đơn hàng{' '}
                {isOpen ? (
                  <ChevronUp className='ml-2 h-4 w-4' />
                ) : (
                  <ChevronDown className='ml-2 h-4 w-4' />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <div className='grid grid-cols-1 gap-4 pt-2 md:grid-cols-2 lg:grid-cols-3'>
              {/* Min Amount */}
              <div className='space-y-2'>
                <Label htmlFor='minAmount'>Số tiền tối thiểu</Label>
                <div className='relative'>
                  <Input
                    id='minAmount'
                    type='number'
                    placeholder='Nhập số tiền tối thiểu'
                    value={filters.minAmount}
                    onChange={(e) =>
                      handleInputChange('minAmount', e.target.value)
                    }
                  />
                  {filters.minAmount && (
                    <Button
                      variant='outline'
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('minAmount')}
                      type='button'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>

              {/* Max Amount */}
              <div className='space-y-2'>
                <Label htmlFor='maxAmount'>Số tiền tối đa</Label>
                <div className='relative'>
                  <Input
                    id='maxAmount'
                    type='number'
                    placeholder='Nhập số tiền tối đa'
                    value={filters.maxAmount}
                    onChange={(e) =>
                      handleInputChange('maxAmount', e.target.value)
                    }
                  />
                  {filters.maxAmount && (
                    <Button
                      variant='outline'
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('maxAmount')}
                      type='button'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className='space-y-2'>
                <Label htmlFor='paymentMethod'>Phương thức thanh toán</Label>
                <div className='relative'>
                  <Select
                    value={filters.paymentMethod}
                    onValueChange={(value) =>
                      handleInputChange('paymentMethod', value as PaymentMethod)
                    }
                  >
                    <SelectTrigger id='paymentMethod' className='w-full'>
                      <SelectValue placeholder='Chọn phương thức thanh toán' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_VALUE}>Tất cả</SelectItem>
                      {Object.values(PaymentMethod).map((method) => (
                        <SelectItem key={method} value={method}>
                          {PaymentMethodLabel[method]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {filters.paymentMethod !== ALL_VALUE && (
                    <Button
                      variant='outline'
                      size='icon'
                      className='absolute right-2 top-0 h-full'
                      onClick={() => clearField('paymentMethod')}
                      type='button'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className='space-y-2'>
                <Label htmlFor='status'>Trạng thái</Label>
                <div className='relative'>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      handleInputChange('status', value as OrderStatus)
                    }
                  >
                    <SelectTrigger id='status' className='w-full'>
                      <SelectValue placeholder='Chọn trạng thái' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_VALUE}>Tất cả</SelectItem>
                      {Object.values(OrderStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {OrderStatusLabel[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {filters.status !== ALL_VALUE && (
                    <Button
                      variant='outline'
                      size='icon'
                      className='absolute right-2 top-0 h-full'
                      onClick={() => clearField('status')}
                      type='button'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='startDate'>Ngày bắt đầu</Label>
                <div className='relative'>
                  <DatePicker
                    id='startDate'
                    className='h-10 w-full px-3 py-2'
                    placeholder='Chọn ngày bắt đầu'
                    format='DD/MM/YYYY'
                    value={filters.startDate}
                    onChange={(date) => handleInputChange('startDate', date)}
                  />
                  {filters.startDate && (
                    <Button
                      variant='outline'
                      size='icon'
                      className='absolute right-2 top-0 h-full'
                      onClick={() => clearField('startDate')}
                      type='button'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='endDate'>Ngày kết thúc</Label>
                <div className='relative'>
                  <DatePicker
                    id='endDate'
                    className='h-10 w-full px-3 py-2'
                    placeholder='Chọn ngày kết thúc'
                    format='DD/MM/YYYY'
                    value={filters.endDate}
                    onChange={(date) => handleInputChange('endDate', date)}
                  />
                  {filters.endDate && (
                    <Button
                      variant='outline'
                      size='icon'
                      className='absolute right-2 top-0 h-full'
                      onClick={() => clearField('endDate')}
                      type='button'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default OrderFilter;
