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
import { RoleEnums, RoleLabels } from '@/enums/role';
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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
  const { store, isLoading: isLoadingStore } = useStoreById(storeIdParam || '');

  // Check if user has required role
  const hasRequiredRole = () => {
    if (!user?.userRoles || !Array.isArray(user.userRoles)) return false;

    return user.userRoles.some((userRole) => {
      const roleName = userRole?.role?.roleName;
      const isApproved = userRole?.isApproved === true;

      return (
        isApproved && (roleName === 'Publisher' || roleName === 'StoreOwner')
      );
    });
  };

  // Get user's role info for display
  const getUserRoleInfo = () => {
    if (!user?.userRoles || !Array.isArray(user.userRoles)) {
      return { approvedRoles: [], pendingRoles: [] };
    }

    const approvedRoles = user.userRoles
      ? user.userRoles
          .filter((ur) => ur?.isApproved === true && ur?.role?.roleName)
          .map((ur) => ur.role?.roleName)
      : [];

    const pendingRoles =
      user.userRoles
        .filter((ur) => ur?.isApproved === false && ur?.role?.roleName)
        .map((ur) => ur.role?.roleName) || [];

    return { approvedRoles, pendingRoles };
  };

  const handleVerifyEmail = () => {
    if (!emailValue.trim()) return;
    setVerifiedEmail(emailValue.trim());
  };

  // Form
  const form = useForm<UserStoreFormValues>({
    resolver: zodResolver(userStoreFormSchema),
    defaultValues: {
      contractNumber: '',
      startDate: null,
      endDate: null,
      status: StoreRent.ACTIVE,
      notes: '',
    },
  });

  const onSubmit = (values: UserStoreFormValues) => {
    try {
      if (!user?.id) {
        toast.error('Vui lòng xác thực email người dùng trước!');
        return;
      }

      if (!storeIdParam) {
        toast.error('Không tìm thấy thông tin cửa hàng!');
        return;
      }

      // Check role requirements
      if (!hasRequiredRole()) {
        const roleInfo = getUserRoleInfo();
        if (roleInfo.pendingRoles.length > 0) {
          toast.error('Tài khoản của bạn đang chờ phê duyệt vai trò!');
        } else {
          toast.error('Chỉ Nhà xuất bản hoặc Chủ cửa hàng được phép đăng ký!');
        }
        return;
      }

      const formData = new FormData();
      formData.append('UserId', user.id);
      formData.append('StoreId', storeIdParam);
      if (values.contractNumber) {
        formData.append('ContractNumber', values.contractNumber);
      }
      if (values.startDate) {
        formData.append(
          'StartDate',
          dayjs(values.startDate).format('YYYY-MM-DD')
        );
      }

      if (values.endDate) {
        formData.append('EndDate', dayjs(values.endDate).format('YYYY-MM-DD'));
      }

      formData.append('Status', values.status);
      if (values.contractFile && values.contractFile instanceof File) {
        formData.append('ContractFile', values.contractFile);
      }
      if (values.notes) {
        formData.append('Notes', values.notes);
      }
      registerStore(formData);
    } catch (error) {
      console.log('Error during form submission:', error);
    }
  };

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Email Verification Section */}
      <Card>
        <CardContent className='p-4 sm:p-6'>
          <div className='mb-4 flex items-center gap-2'>
            <Mail className='h-5 w-5 text-primary' />
            <h3 className='text-base font-semibold sm:text-lg'>
              Thông tin người đăng ký
            </h3>
          </div>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <p className='text-sm font-medium'>Email người dùng</p>
              <div className='flex flex-col gap-2 sm:flex-row'>
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
                      <CheckCircle className='h-4 w-4 text-green-500' />
                    )}
                    {!userLoading && !user && verifiedEmail && (
                      <AlertCircle className='h-4 w-4 text-red-500' />
                    )}
                  </div>
                </div>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleVerifyEmail}
                  disabled={!emailValue.trim() || userLoading}
                  className='w-full px-4 sm:w-auto sm:px-6'
                >
                  {userLoading ? (
                    <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                  ) : (
                    <>
                      <Search className='mr-2 h-4 w-4' />
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
                  <div className='rounded-lg bg-muted p-3 sm:p-4'>
                    <UserInfo user={user} />
                    {/* Role Status Display */}
                    {(() => {
                      const roleInfo = getUserRoleInfo();
                      const hasRequired = hasRequiredRole();

                      return (
                        <div className='mt-3 border-t pt-3'>
                          <p className='mb-2 text-sm font-medium'>Vai trò:</p>
                          {roleInfo.approvedRoles.length > 0 && (
                            <div className='mb-2 flex flex-wrap gap-1.5 sm:gap-2'>
                              {roleInfo.approvedRoles.map((role, idx) => (
                                <span
                                  key={idx}
                                  className={`rounded px-1.5 py-0.5 text-xs sm:px-2 sm:py-1 ${
                                    role === 'Publisher' ||
                                    role === 'StoreOwner'
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                      : 'bg-secondary text-secondary-foreground'
                                  }`}
                                >
                                  {RoleLabels[role as RoleEnums] || role} ✓
                                </span>
                              ))}
                            </div>
                          )}
                          {roleInfo.pendingRoles.length > 0 && (
                            <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                              {roleInfo.pendingRoles.map((role, idx) => (
                                <span
                                  key={idx}
                                  className='rounded bg-yellow-100 px-1.5 py-0.5 text-xs text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 sm:px-2 sm:py-1'
                                >
                                  {RoleLabels[role as RoleEnums] || role} (Chờ
                                  duyệt)
                                </span>
                              ))}
                            </div>
                          )}
                          {!hasRequired && (
                            <p className='mt-2 text-xs text-destructive'>
                              ⚠️ Cần có vai trò Nhà xuất bản hoặc Chủ cửa hàng
                              đã được phê duyệt để đăng ký
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {!userLoading && !user && verifiedEmail && (
                  <div className='rounded-lg border border-destructive/50 bg-destructive/10 p-3 sm:p-4'>
                    <div className='flex items-center gap-2'>
                      <AlertCircle className='h-4 w-4 text-destructive' />
                      <span className='text-sm font-medium text-destructive'>
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
      {storeIdParam && (
        <Card>
          <CardContent className='p-4 sm:p-6'>
            <div className='mb-4 flex items-center gap-2'>
              <Store className='h-5 w-5 text-primary' />
              <h3 className='text-base font-semibold sm:text-lg'>
                Thông tin cửa hàng
              </h3>
            </div>

            {isLoadingStore ? (
              <div className='text-sm text-muted-foreground'>
                <div className='animate-pulse'>
                  Đang tải thông tin cửa hàng...
                </div>
              </div>
            ) : store ? (
              <div className='grid grid-cols-1 gap-3 text-sm md:grid-cols-2'>
                <div className='flex flex-col sm:flex-row'>
                  <span className='text-muted-foreground'>Tên cửa hàng:</span>
                  <span className='font-medium sm:ml-2'>
                    {store.storeName || 'N/A'}
                  </span>
                </div>
                <div className='flex flex-col sm:flex-row'>
                  <span className='text-muted-foreground'>Địa chỉ:</span>
                  <span className='font-medium sm:ml-2'>
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
        <CardContent className='p-4 sm:p-6'>
          <h3 className='mb-4 text-base font-semibold sm:mb-6 sm:text-lg'>
            Thông tin hợp đồng
          </h3>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(onSubmit)(e);
              }}
              className='space-y-4 sm:space-y-6'
            >
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
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='startDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày bắt đầu</FormLabel>
                      <FormControl>
                        <DatePicker
                          className='h-10 w-full'
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
                          className='h-10 w-full'
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
              <div className='flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end sm:gap-4'>
                <Button
                  variant='outline'
                  type='button'
                  asChild
                  className='w-full sm:w-auto'
                  disabled={isRegisteringStore}
                >
                  <Link href={PATH.USER_STORES}>Hủy</Link>
                </Button>
                <Button
                  type='submit'
                  disabled={
                    isRegisteringStore || !user?.id || !hasRequiredRole()
                  }
                  className='w-full sm:w-auto'
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
