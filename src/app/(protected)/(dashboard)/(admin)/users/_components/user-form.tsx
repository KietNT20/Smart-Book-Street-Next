'use client';

import CancelButton from '@/components/back-btn/cancel-btn';
import SubmitBtn from '@/components/button/submit-btn';
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
import useDebounce from '@/hooks/use-debounce';
import { useUserMutation } from '@/hooks/use-user';
import { userFormSchema, UserFormValues } from '@/lib/zod';
import { User } from '@/types/user-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'antd';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  userToEdit?: User;
};

const UserForm = ({ userToEdit }: Props) => {
  const { createUser, createUserPending, updateUser, updateUserPending } =
    useUserMutation();
  const router = useRouter();
  const isWorking = useDebounce(createUserPending || updateUserPending, 300);
  const [previewMainImage, setPreviewMainImage] = useState<string | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      userName: userToEdit?.userName || '',
      email: userToEdit?.email || '',
      password: undefined,
      fullName: userToEdit?.fullName || '',
      phone: userToEdit?.phone || '',
      dob: userToEdit?.dob || null,
      addresss: userToEdit?.address || '',
      gender: userToEdit?.gender || undefined,
      mainImageFile: null,
      additionalImageFiles: [],
    },
  });

  function onSubmit(values: UserFormValues) {
    try {
      const formData = new FormData();

      if (values.userName) {
        formData.append('UserName', values.userName);
      }

      if (values.email) {
        formData.append('Email', values.email);
      }

      if (values.password) {
        formData.append('Password', values.password);
      }

      if (values.fullName) {
        formData.append('FullName', values.fullName);
      }

      if (values.phone) {
        formData.append('Phone', values.phone);
      }

      if (values.dob) {
        formData.append('Dob', values.dob);
      }

      if (values.addresss) {
        formData.append('Addresss', values.addresss);
      }

      if (values.gender) {
        formData.append('Gender', values.gender);
      }

      if (values.mainImageFile instanceof File) {
        formData.append('MainImageFile', values.mainImageFile);
      }

      if (userToEdit?.id) {
        updateUser(
          { id: userToEdit.id, formData },
          {
            onSuccess: () => {
              router.replace(PATH.USERS);
            },
          }
        );
      } else {
        createUser(formData, {
          onSuccess: () => {
            router.replace(PATH.USERS);
          },
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('mainImageFile', file, { shouldValidate: true });

      const imageUrl = URL.createObjectURL(file);
      setPreviewMainImage(imageUrl);
    }
  };

  const removeMainImage = () => {
    setPreviewMainImage(null);
    form.setValue('mainImageFile', null, { shouldValidate: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {userToEdit ? 'Chỉnh sửa người dùng' : 'Tạo mới người dùng'}
        </CardTitle>
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
                          disabled={isWorking || !!userToEdit}
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
                      <FormLabel>
                        {userToEdit
                          ? 'Mật khẩu mới (để trống nếu không thay đổi)'
                          : 'Mật khẩu'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder={
                            userToEdit
                              ? 'Nhập mật khẩu mới nếu muốn thay đổi'
                              : 'Nhập mật khẩu'
                          }
                          disabled={isWorking}
                          {...field}
                          value={field.value || ''}
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
                          value={field.value || ''}
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
                          value={field.value || ''}
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
                  name='addresss'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Nhập địa chỉ'
                          disabled={isWorking}
                          {...field}
                          value={field.value || ''}
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

              <SubmitBtn ID={userToEdit?.id} _onPending={isWorking} />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
