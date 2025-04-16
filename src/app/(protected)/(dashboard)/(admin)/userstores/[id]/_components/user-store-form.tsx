'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PATH } from '@/enums/path';
import { StoreRent } from '@/enums/store-rent';
import { useStoreById } from '@/hooks/use-store';
import { useUserStoresMutation } from '@/hooks/use-user-store';
import { userStoreFormSchema, UserStoreFormValues } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { Store as StoreIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import StoreSearch from './search-store';

const UserStoreForm = () => {
  const params = useParams();
  const userId = params.id as string;

  const { registerStore, isRegisteringStore } = useUserStoresMutation();

  const form = useForm<UserStoreFormValues>({
    resolver: zodResolver(userStoreFormSchema),
    defaultValues: {
      storeId: '',
      contractNumber: '',
      startDate: '',
      endDate: '',
      status: StoreRent.ACTIVE,
      notes: '',
    },
  });

  const storeId = form.watch('storeId');
  const { store, isLoading: isLoadingStore } = useStoreById(storeId);

  function onSubmit(values: UserStoreFormValues) {
    const payload = {
      storeId: values.storeId,
      contractNumber: values.contractNumber,
      startDate: values.startDate,
      endDate: values.endDate,
      status: values.status,
      notes: values.notes,
      userId: userId,
    };
    registerStore(payload, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  const handleSelectStore = (storeId: string) => {
    form.setValue('storeId', storeId);
  };

  const handleClearStore = () => {
    form.setValue('storeId', '');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='space-y-4'>
          <FormLabel>Cửa hàng</FormLabel>

          {/* Hiển thị thông tin cửa hàng đã chọn */}
          {storeId && (
            <Card className='w-full'>
              <CardContent className='p-4'>
                <div className='mb-2 flex items-center justify-between'>
                  <div className='flex items-center'>
                    <StoreIcon className='mr-2 text-blue-500' size={18} />
                    <span className='font-medium'>Thông tin cửa hàng</span>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleClearStore}
                    type='button'
                    className='h-8 w-8 p-0'
                  >
                    <X size={16} />
                  </Button>
                </div>

                {isLoadingStore ? (
                  <p className='text-sm text-muted-foreground'>
                    Đang tải thông tin...
                  </p>
                ) : store ? (
                  <div className='space-y-2 text-sm'>
                    <div className='flex items-center gap-3'>
                      <span className='text-muted-foreground'>
                        Tên cửa hàng:
                      </span>
                      <span className='font-medium'>
                        {store.storeName || 'N/A'}
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span className='text-muted-foreground'>Địa chỉ:</span>
                      <span className='font-medium'>
                        {store.address || 'N/A'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className='text-sm text-muted-foreground'>
                    Không tìm thấy thông tin cửa hàng
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Nút tìm kiếm cửa hàng, chỉ hiển thị khi chưa chọn cửa hàng */}
          {!storeId && (
            <div className='flex items-center space-x-2'>
              <FormField
                control={form.control}
                name='storeId'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <div className='flex items-center space-x-2'>
                        <StoreSearch
                          onSelectStore={handleSelectStore}
                          value={field.value}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name='contractNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số hợp đồng</FormLabel>
              <FormControl>
                <Input
                  placeholder='Số hợp đồng'
                  disabled={isRegisteringStore}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='startDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày bắt đầu</FormLabel>
                <FormControl>
                  <DatePicker
                    className='w-full px-3 py-2'
                    format='YYYY-MM-DD'
                    placeholder='Chọn ngày bắt đầu'
                    disabled={isRegisteringStore}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date ? date.format('YYYY-MM-DD') : null);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='endDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày kết thúc</FormLabel>
                <FormControl>
                  <DatePicker
                    className='w-full px-3 py-2'
                    format='YYYY-MM-DD'
                    placeholder='Chọn ngày kết thúc'
                    disabled={isRegisteringStore}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date ? date.format('YYYY-MM-DD') : null);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tình trạng</FormLabel>
              <FormControl>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  disabled={isRegisteringStore}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Chọn trạng thái' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={StoreRent.ACTIVE}>Hoạt động</SelectItem>
                    <SelectItem value={StoreRent.EXPIRED}>Hết hạn</SelectItem>
                    <SelectItem value={StoreRent.TERMINATED}>
                      Ngừng hoạt động
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='notes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder='Ghi chú'
                  disabled={isRegisteringStore}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex items-center justify-end space-x-2'>
          <Button variant={'outline'}>
            <Link href={PATH.USER_STORES}>Hủy</Link>
          </Button>
          <Button type='submit' disabled={isRegisteringStore || !storeId}>
            {isRegisteringStore ? 'Đang...' : 'Đăng ký'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserStoreForm;
