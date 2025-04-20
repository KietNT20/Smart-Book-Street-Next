'use client';

import CancelButton from '@/components/back-btn/cancel-btn';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Gender } from '@/enums/gender';
import { PATH } from '@/enums/path';
import { Image } from 'antd';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { useUserForm } from '../_lib/use-user-form';

const UserForm = () => {
  const {
    form,
    isWorking,
    onSubmit,
    previewMainImage,
    handleMainFileChange,
    removeMainImage,
  } = useUserForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{'Tạo mới người dùng'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Thông tin cơ bản - Cột trái */}
              <div className='space-y-6'>
                <FormField
                  control={form.control}
                  name='userName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên đăng nhập</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Nhập tên đăng nhập'
                          disabled={isWorking}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='Nhập email'
                          disabled={isWorking}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder={'Nhập mật khẩu'}
                          disabled={isWorking}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='fullName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Nhập họ và tên'
                          disabled={isWorking}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Thông tin cơ bản - Cột phải */}
              <div className='space-y-6'>
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Nhập số điện thoại'
                          disabled={isWorking}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='dob'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày sinh</FormLabel>
                      <FormControl>
                        <Input
                          type='date'
                          disabled={isWorking}
                          {...field}
                          value={
                            field.value
                              ? dayjs(field.value).format('YYYY-MM-DD')
                              : ''
                          }
                          onChange={(e) => {
                            field.onChange(
                              e.target.value ? e.target.value : null
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
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Nhập địa chỉ'
                          disabled={isWorking}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='gender'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giới tính</FormLabel>
                      <Select
                        disabled={isWorking}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn giới tính' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={Gender.Male}>Nam</SelectItem>
                          <SelectItem value={Gender.Female}>Nữ</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Phần ảnh đại diện */}
            <div className='mt-8'>
              <div className='flex flex-col md:gap-8'>
                <div className='space-y-2'>
                  <FormLabel>Ảnh đại diện</FormLabel>
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={handleMainFileChange}
                    disabled={isWorking}
                    className='mb-2'
                  />
                  {form.formState.errors.mainImageFile && (
                    <p className='text-sm text-red-500'>
                      {form.formState.errors.mainImageFile.message?.toString()}
                    </p>
                  )}
                </div>

                {/* Xem trước ảnh đại diện */}
                {previewMainImage && (
                  <div className='relative mt-4 w-40 shrink-0 overflow-hidden rounded-md border md:mt-0'>
                    <Image src={previewMainImage} alt='Ảnh đại diện' />
                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
                      className='absolute right-2 top-2 h-8 w-8 rounded-full'
                      onClick={removeMainImage}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className='mt-8 flex items-center justify-end gap-4'>
              <CancelButton
                _isPending={isWorking}
                pathUrl={PATH.USERS}
                routerReplace
              />

              <Button type='submit' disabled={isWorking}>
                {isWorking ? 'Đang xử lý...' : 'Lưu'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
