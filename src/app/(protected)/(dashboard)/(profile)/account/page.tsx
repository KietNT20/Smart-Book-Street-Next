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
import { PATH } from '@/enums/path';
import { useAuth } from '@/hooks/use-auth';
import { getVietnameseRoleLabel } from '@/utils/format';
import dayjs from 'dayjs';
import { ArrowLeft, CalendarIcon, Mail, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserDetailSkeleton from '../_components/user-skeleton';
import useProfileForm, { UseUserFormProps } from './_hooks/use-profile-form';

export default function ProfilePage() {
  const { user, isLoading: userLoading, error: userError } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const {
    form,
    isEditing,
    isSubmitting,
    previewImage,
    handleImageChange,
    onSubmit,
    startEditing,
    cancelEdit,
  } = useProfileForm({
    user: user as UseUserFormProps['user'],
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if ((userError || !user) && isClient) {
    return (
      <Card className='mx-auto max-w-3xl'>
        <CardHeader>
          <CardTitle className='text-center'>
            Không tìm thấy thông tin
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <p className='mb-6 text-muted-foreground'>
            Thông tin người dùng không tồn tại hoặc đã bị xóa
          </p>
          <Button onClick={() => router.replace(PATH.USERS)}>
            Quay lại danh sách
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!isClient) {
    return null;
  }

  if (userLoading || !isClient) {
    return <UserDetailSkeleton />;
  }

  return (
    <div className='container py-8'>
      <div className='mb-6 flex items-center'>
        <Button
          variant='ghost'
          className='mr-4'
          onClick={() => router.push(PATH.ACCOUNT)}
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Quay lại
        </Button>
      </div>

      {!isEditing ? (
        // VIEW MODE - Hiển thị thông tin
        <div className='grid gap-6 md:grid-cols-3'>
          {/* Thông tin cơ bản */}
          <Card className='md:col-span-2'>
            <CardHeader>
              <CardTitle className='text-center'>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4 md:grid-cols-2'>
                {user?.userName && (
                  <div>
                    <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                      Tên đăng nhập
                    </h3>
                    <p className='font-medium'>{user.userName}</p>
                  </div>
                )}

                {user?.email && (
                  <div>
                    <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                      Email
                    </h3>
                    <p className='font-medium'>{user.email}</p>
                  </div>
                )}

                {user?.fullName && (
                  <div>
                    <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                      Họ và tên
                    </h3>
                    <p className='font-medium'>{user.fullName}</p>
                  </div>
                )}

                {user?.phone && (
                  <div>
                    <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                      Số điện thoại
                    </h3>
                    <p className='font-medium'>{user.phone}</p>
                  </div>
                )}

                {user?.gender && (
                  <div>
                    <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                      Giới tính
                    </h3>
                    <p className='font-medium'>{user.gender}</p>
                  </div>
                )}

                {user?.dob && (
                  <div>
                    <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                      Ngày sinh
                    </h3>
                    <p className='font-medium'>
                      {dayjs(user.dob).format('DD/MM/YYYY')}
                    </p>
                  </div>
                )}

                {user?.address && (
                  <div className='md:col-span-2'>
                    <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                      Địa chỉ
                    </h3>
                    <p className='font-medium'>{user.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {/* Quyền và vai trò */}
              {user?.userRoles && user.userRoles.length > 0 && (
                <Card className='w-full'>
                  <CardHeader>
                    <CardTitle className='text-center'>
                      Vai trò và quyền hạn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='flex flex-wrap gap-2'>
                      {user.userRoles.map((role, index) => (
                        <div
                          key={index}
                          className='rounded-full bg-darker px-3 py-1 text-base font-medium text-darker-foreground'
                        >
                          {role.role
                            ? getVietnameseRoleLabel(role.role?.roleName)
                            : 'Chưa có vai trò'}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardFooter>
          </Card>

          {/* Ảnh đại diện và thông tin nhanh */}
          <Card>
            <CardContent className='pt-6'>
              <div className='flex flex-col items-center text-center'>
                {user?.mainImageFile ? (
                  <div className='relative mb-4 h-40 w-40 overflow-hidden rounded-full'>
                    <Image
                      src={user.mainImageFile}
                      alt={user.fullName || user.userName || ''}
                      fill
                      className='object-cover'
                    />
                  </div>
                ) : (
                  <div className='mb-4 flex h-40 w-40 items-center justify-center rounded-full bg-muted'>
                    <User className='h-20 w-20 text-muted-foreground' />
                  </div>
                )}

                <h2 className='mb-1 text-xl font-bold'>{user?.fullName}</h2>
                <p className='mb-4 text-muted-foreground'>@{user?.userName}</p>

                {user?.email && (
                  <div className='mb-2 flex items-center text-muted-foreground'>
                    <Mail className='mr-2 h-4 w-4' />
                    <span>{user.email}</span>
                  </div>
                )}

                <div className='mt-4 grid w-full'>
                  <Button variant='darker' onClick={startEditing}>
                    Chỉnh sửa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // EDIT MODE
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
                <Button type='button' variant='outline' onClick={cancelEdit}>
                  Hủy
                </Button>
                <Button
                  type='submit'
                  variant={'darker'}
                  disabled={isSubmitting}
                >
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

                  <Label
                    htmlFor='avatar-upload'
                    className='mb-4 cursor-pointer'
                  >
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
      )}
    </div>
  );
}
