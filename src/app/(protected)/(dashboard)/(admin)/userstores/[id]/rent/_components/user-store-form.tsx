'use client';

import { Button } from '@/components/ui/button';
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
import { RoleEnums } from '@/enums/role';
import { StoreRent } from '@/enums/store-rent';
import { useStoreById } from '@/hooks/use-store';
import { useUserEmail } from '@/hooks/use-user';
import { useUserStoresMutation } from '@/hooks/use-user-store';
import { userStoreFormSchema, UserStoreFormValues } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import EmailVerificationStep from './email-verification-step';
import FileUploadField from './file-upload-field';
import StoreInfoCard from './store-info-card';
import UserConfirmationStep from './user-confirmation-step';
import UserInfoCard from './user-info-card';

type Props = {
  storeIdParam?: string;
};

const UserStoreForm = ({ storeIdParam }: Props) => {
  // State management
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isUserConfirmed, setIsUserConfirmed] = useState(false);

  const isUnmountedRef = useRef(false);

  // Hooks
  const { user, userLoading } = useUserEmail(verifiedEmail);
  const { registerStore, isRegisteringStore } = useUserStoresMutation();

  const form = useForm<UserStoreFormValues>({
    resolver: zodResolver(userStoreFormSchema),
    defaultValues: {
      userId: '',
      storeId: storeIdParam || '',
      contractNumber: '',
      startDate: '',
      endDate: '',
      status: StoreRent.ACTIVE,
      notes: '',
    },
  });

  const storeId = useMemo(() => {
    return storeIdParam || '';
  }, [storeIdParam]);

  const { store, isLoading: isLoadingStore } = useStoreById(storeId || '');

  // Helper functions
  const canRegisterStore = useCallback(() => {
    if (!user?.userRoles || user.userRoles.length === 0) return false;

    return user?.userRoles?.some(
      (userRole) =>
        userRole &&
        userRole.role &&
        userRole.role.roleName &&
        userRole.isApproved === true &&
        (userRole.role.roleName === RoleEnums.STORE_OWNER ||
          userRole.role.roleName === RoleEnums.PUBLISHER)
    );
  }, [user?.userRoles]);

  // Event handlers
  const handleVerifyEmail = useCallback((email: string) => {
    setVerifiedEmail(email);
    setIsEmailVerified(true);
  }, []);

  const handleConfirmUser = useCallback(() => {
    if (!user?.id || !canRegisterStore()) return;

    if (!isUnmountedRef.current) {
      form.setValue('userId', user.id);
      setIsUserConfirmed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, canRegisterStore]);

  const handleResetEmailVerification = useCallback(() => {
    if (!isUnmountedRef.current) {
      setIsEmailVerified(false);
      setIsUserConfirmed(false);
      setVerifiedEmail('');

      form.reset({
        userId: '',
        storeId: storeIdParam || '',
        contractNumber: '',
        startDate: '',
        endDate: '',
        status: StoreRent.ACTIVE,
        notes: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeIdParam]);

  const handleTryAnotherEmail = useCallback(() => {
    setVerifiedEmail('');
    setIsEmailVerified(false);
  }, []);

  // Render steps
  if (!isEmailVerified) {
    return (
      <EmailVerificationStep
        onVerify={handleVerifyEmail}
        isLoading={userLoading}
      />
    );
  }

  if (isEmailVerified && !isUserConfirmed) {
    return (
      <UserConfirmationStep
        user={user}
        isLoading={userLoading}
        onConfirm={handleConfirmUser}
        onReset={handleResetEmailVerification}
        onTryAnotherEmail={handleTryAnotherEmail}
      />
    );
  }

  const onSubmit = (values: UserStoreFormValues) => {
    const formData = new FormData();

    formData.append('userId', values.userId);
    formData.append('storeId', values.storeId);
    formData.append('contractNumber', values.contractNumber);
    formData.append('startDate', dayjs(values.startDate).format('YYYY-MM-DD'));
    formData.append('endDate', dayjs(values.endDate).format('YYYY-MM-DD'));
    formData.append('status', values.status);
    formData.append('contractFile', values.contractFile);
    if (values.notes) {
      formData.append('notes', values.notes);
    }

    registerStore(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        {/* User Info Display */}
        <UserInfoCard user={user} onReset={handleResetEmailVerification} />

        {/* Store Selection */}
        <div className='space-y-4'>
          <h3 className='text-sm font-medium leading-none'>Cửa hàng</h3>
          {storeId && (
            <StoreInfoCard store={store} isLoading={isLoadingStore} />
          )}
        </div>

        {/* Contract Number */}
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
                    className='h-10 w-full px-3 py-2'
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

        {/* File Upload */}
        <FormField
          control={form.control}
          name='contractFile'
          render={({ field }) => (
            <FormItem>
              <FormLabel>File hợp đồng</FormLabel>
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

        {/* Submit Buttons */}
        <div className='flex items-center justify-end space-x-2'>
          <Button variant='outline'>
            <Link href={PATH.USER_STORES}>Hủy</Link>
          </Button>
          <Button type='submit' disabled={isRegisteringStore || !storeId}>
            {isRegisteringStore ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserStoreForm;
