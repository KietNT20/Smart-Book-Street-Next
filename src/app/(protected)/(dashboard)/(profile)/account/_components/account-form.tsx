'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Gender } from '@/enums/gender';
import { useAuth } from '@/hooks/use-auth';
import dayjs from 'dayjs';
import { CalendarIcon, User } from 'lucide-react';
import Image from 'next/image';
import useProfileForm, { UseUserFormProps } from '../_hooks/use-profile-form';

const AccountForm = () => {
  const { user } = useAuth();
  const { form, isSubmitting, previewImage, handleImageChange, onSubmit } =
    useProfileForm({
      user: user as UseUserFormProps['user'],
    });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='grid gap-6 md:grid-cols-3'
      >
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle className='text-center'>
              Chỉnh sửa thông tin cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='userName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input placeholder='Tên đăng nhập' {...field} />
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
                        placeholder='Mật khẩu'
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
                      <Input placeholder='Email' {...field} />
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
                      <Input placeholder='Họ và tên' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder='Số điện thoại' {...field} />
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
                      onValueChange={field.onChange}
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

              <FormField
                control={form.control}
                name='dob'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type='date'
                          className='w-full'
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
                        <CalendarIcon className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                      </div>
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
                      <Input placeholder='Địa chỉ' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className='flex justify-end space-x-2'>
            <Button type='submit' variant={'darker'} disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </CardFooter>
        </Card>

        {/* Ảnh đại diện */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center text-center'>
              {previewImage ? (
                <div className='relative mb-4 h-40 w-40 overflow-hidden rounded-full'>
                  <Image
                    src={previewImage}
                    alt='Avatar preview'
                    fill
                    className='object-cover'
                  />
                </div>
              ) : (
                <div className='mb-4 flex h-40 w-40 items-center justify-center rounded-full bg-muted'>
                  <User className='h-20 w-20 text-muted-foreground' />
                </div>
              )}

              <Label htmlFor='avatar-upload' className='mb-4 cursor-pointer'>
                <div className='rounded-md bg-darker px-4 py-2 text-darker-foreground hover:bg-darker/90'>
                  Chọn ảnh đại diện
                </div>
                <Input
                  type='file'
                  id='avatar-upload'
                  accept='image/*'
                  className='hidden'
                  onChange={handleImageChange}
                />
              </Label>

              <p className='text-sm text-muted-foreground'>
                Chọn ảnh định dạng JPG, PNG hoặc GIF
              </p>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default AccountForm;
