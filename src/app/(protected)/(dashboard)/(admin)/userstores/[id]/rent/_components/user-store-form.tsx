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
import { useUserEmail } from '@/hooks/use-user';
import { useUserStoresMutation } from '@/hooks/use-user-store';
import { userStoreFormSchema, UserStoreFormValues } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { AlertCircle, CheckCircle, Mail, Search, Store } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import FileUploadField from './file-upload-field';
import UserInfo from './user-info';

type Props = {
  storeIdParam?: string;
};

const UserStoreForm = ({ storeIdParam }: Props) => {
  const [emailValue, setEmailValue] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');

  // Hooks
  const { user, userLoading } = useUserEmail(verifiedEmail);
  const { registerStore, isRegisteringStore } = useUserStoresMutation();

  const storeId = useMemo(() => storeIdParam || '', [storeIdParam]);
  const { store, isLoading: isLoadingStore } = useStoreById(storeId);

  const handleVerifyEmail = () => {
    if (!emailValue.trim()) return;
    setVerifiedEmail(emailValue.trim());
  };

  // Form
  const form = useForm<UserStoreFormValues>({
    resolver: zodResolver(userStoreFormSchema),
    defaultValues: {
      userId: user?.id || '',
      storeId: storeIdParam || '',
      contractNumber: '',
      startDate: null,
      endDate: null,
      status: StoreRent.ACTIVE,
      notes: '',
    },
  });

  const onSubmit = (values: UserStoreFormValues) => {
    if (!user?.id) return;

    const formData = new FormData();
    formData.append('userId', values.userId);
    formData.append('storeId', values.storeId);
    formData.append('contractNumber', values.contractNumber);
    if (values.startDate) {
      formData.append(
        'startDate',
        dayjs(values.startDate).format('YYYY-MM-DD')
      );
    }

    if (values.endDate) {
      formData.append('endDate', dayjs(values.endDate).format('YYYY-MM-DD'));
    }

    formData.append('status', values.status);
    formData.append('contractFile', values.contractFile);
    if (values.notes) {
      formData.append('notes', values.notes);
    }

    registerStore(formData);
  };

  return (
    <div className='space-y-6'>
      {/* Email Verification Section */}
      <Card>
        <CardContent className='p-6'>
          <div className='mb-4 flex items-center gap-2'>
            <Mail className='text-primary' size={20} />
            <h3 className='font-semibold'>Thông tin người đăng ký</h3>
          </div>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <p className='text-sm font-medium'>Email người dùng</p>
              <div className='flex gap-2'>
                <div className='relative flex-1'>
                  <Input
                    type='email'
                    placeholder='Nhập email người dùng'
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    className='pr-10'
                  />
                  <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                    {userLoading && (
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                    )}
                    {!userLoading && user && verifiedEmail && (
                      <CheckCircle className='text-green-500' size={16} />
                    )}
                    {!userLoading && !user && verifiedEmail && (
                      <AlertCircle className='text-red-500' size={16} />
                    )}
                  </div>
                </div>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleVerifyEmail}
                  disabled={!emailValue.trim() || userLoading}
                  className='px-6'
                >
                  {userLoading ? (
                    <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                  ) : (
                    <>
                      <Search size={16} className='mr-2' />
                      Xác thực
                    </>
                  )}
                </Button>
              </div>
              <p className='text-xs text-muted-foreground'>
                {`Nhập email người dùng và nhấn "Xác thực" để tìm kiếm thông tin.`}
              </p>
            </div>

            {/* User Info Display */}
            {verifiedEmail && (
              <div className='mt-4'>
                {userLoading && (
                  <div className='text-sm text-muted-foreground'>
                    <div className='animate-pulse'>
                      Đang tìm kiếm người dùng...
                    </div>
                  </div>
                )}

                {!userLoading && user && (
                  <div className='rounded-lg bg-muted p-4'>
                    <UserInfo user={user} />
                  </div>
                )}

                {!userLoading && !user && verifiedEmail && (
                  <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
                    <div className='flex items-center gap-2'>
                      <AlertCircle className='text-red-500' size={16} />
                      <span className='text-sm font-medium text-red-700'>
                        Không tìm thấy người dùng với email này
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Store Information */}
      {storeId && (
        <Card>
          <CardContent className='p-6'>
            <div className='mb-4 flex items-center gap-2'>
              <Store className='text-primary' size={20} />
              <h3 className='font-semibold'>Thông tin cửa hàng</h3>
            </div>

            {isLoadingStore ? (
              <div className='text-sm text-muted-foreground'>
                <div className='animate-pulse'>
                  Đang tải thông tin cửa hàng...
                </div>
              </div>
            ) : store ? (
              <div className='grid grid-cols-1 gap-3 text-sm md:grid-cols-2'>
                <div>
                  <span className='text-muted-foreground'>Tên cửa hàng:</span>
                  <span className='ml-2 font-medium'>
                    {store.storeName || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className='text-muted-foreground'>Địa chỉ:</span>
                  <span className='ml-2 font-medium'>
                    {store.address || 'N/A'}
                  </span>
                </div>
              </div>
            ) : (
              <div className='text-sm text-muted-foreground'>
                Không tìm thấy thông tin cửa hàng
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Form */}
      <Card>
        <CardContent className='p-6'>
          <h3 className='mb-6 font-semibold'>Thông tin hợp đồng</h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* Contract Number */}
              <FormField
                control={form.control}
                name='contractNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số hợp đồng</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập số hợp đồng'
                        disabled={isRegisteringStore}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Fields */}
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='startDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày bắt đầu</FormLabel>
                      <FormControl>
                        <DatePicker
                          className='h-10 w-full px-3 py-2'
                          format='YYYY-MM-DD'
                          placeholder='Chọn ngày bắt đầu'
                          disabled={isRegisteringStore}
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(date) => {
                            field.onChange(
                              date ? date.format('YYYY-MM-DD') : null
                            );
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
                          className='h-10 w-full px-3 py-2'
                          format='YYYY-MM-DD'
                          placeholder='Chọn ngày kết thúc'
                          disabled={isRegisteringStore}
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(date) => {
                            field.onChange(
                              date ? date.format('YYYY-MM-DD') : null
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Status */}
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
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn trạng thái' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={StoreRent.ACTIVE}>
                            Hoạt động
                          </SelectItem>
                          <SelectItem value={StoreRent.EXPIRED}>
                            Hết hạn
                          </SelectItem>
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

              {/* File Upload */}
              <FormField
                control={form.control}
                name='contractFile'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File hợp đồng</FormLabel>
                    <div className='mb-2 text-sm text-muted-foreground'>
                      Chấp nhận file PDF, JPEG hoặc PNG
                    </div>
                    <FormControl>
                      <FileUploadField
                        onChange={field.onChange}
                        disabled={isRegisteringStore}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ghi chú (không bắt buộc)'
                        disabled={isRegisteringStore}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Buttons */}
              <div className='flex items-center justify-end gap-4 pt-4'>
                <Button variant='outline' type='button'>
                  <Link href={PATH.USER_STORES}>Hủy</Link>
                </Button>
                <Button
                  type='submit'
                  disabled={isRegisteringStore || !user?.id}
                >
                  {isRegisteringStore ? 'Đang đăng ký...' : 'Đăng ký cửa hàng'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStoreForm;
