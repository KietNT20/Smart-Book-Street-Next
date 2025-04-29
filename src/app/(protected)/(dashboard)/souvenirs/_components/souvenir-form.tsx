'use client';

import CancelButton from '@/components/back-btn/cancel-btn';
import SubmitBtn from '@/components/button/submit-btn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PATH } from '@/enums/path';
import { Souvenir } from '@/types/souvenir-types';
import { Image } from 'antd';
import { useSouvenirForm } from '../_hooks/use-souvenir-form';

type Props = {
  souvenirToEdit?: Souvenir;
};

const SouvenirForm = ({ souvenirToEdit }: Props) => {
  const { form, onSubmit, handleMainImageChange, mainImagePreview, isPending } =
    useSouvenirForm({ souvenirToEdit });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {souvenirToEdit ? 'Chỉnh sửa quà lưu niệm' : 'Tạo mới quà lưu niệm'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='souvenirName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên quà lưu niệm</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nhập tên quà lưu niệm'
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Nhập giá'
                      disabled={isPending}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Nhập mô tả cho quà lưu niệm'
                      className='resize-none'
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mô tả chi tiết về quà lưu niệm (tùy chọn)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='baseImgFile'
              render={() => (
                <FormItem>
                  <FormLabel>Ảnh chính</FormLabel>
                  <FormControl>
                    <div className='space-y-4'>
                      <Input
                        type='file'
                        accept='image/*'
                        onChange={handleMainImageChange}
                        disabled={isPending}
                      />
                      {mainImagePreview && (
                        <div className='relative flex h-80 w-80 items-center justify-center overflow-hidden'>
                          <Image
                            src={mainImagePreview}
                            alt='Preview'
                            className='h-auto max-w-full'
                          />
                        </div>
                      )}
                      {souvenirToEdit?.baseImgUrl && (
                        <div className='relative flex h-80 w-80 items-center justify-center overflow-hidden'>
                          <Image
                            src={souvenirToEdit.baseImgUrl}
                            alt={souvenirToEdit.souvenirName}
                            className='h-full w-full rounded-md object-cover'
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Tải lên ảnh chính cho quà lưu niệm, yêu cầu 600x600px
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end space-x-4'>
              <CancelButton
                _isPending={isPending}
                pathUrl={PATH.SOUVENIRS}
                routerReplace
              />
              <SubmitBtn _onPending={isPending} ID={souvenirToEdit?.id} />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SouvenirForm;
