'use client';

import CancelButton from '@/components/back-btn/cancel-btn';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { PATH } from '@/enums/path';
import { Publisher } from '@/types/publisher-types';
import { Image } from 'antd';
import { X } from 'lucide-react';
import { usePublisherForm } from '../_hooks/use-publisher-form';

type Props = {
  publisher?: Publisher;
};

const PublisherForm = ({ publisher }: Props) => {
  const {
    form,
    isWorking,
    onSubmit: _onSubmit,
    previewMainImage,
    previewAdditionalFiles,
    handleMainFileChange,
    handleAdditionalFilesChange,
    removeMainImage,
    removeAdditionalImage,
    setUserEmail,
    validateManagerEmail,
    files,
    managerId,
    userEmail,
  } = usePublisherForm({ publisher });

  return (
    <Card>
      <CardHeader>
        <h2 className='text-3xl font-bold'>
          {publisher ? 'Chỉnh sửa nhà xuất bản' : 'Tạo mới nhà xuất bản'}
        </h2>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            action='#'
            onSubmit={form.handleSubmit(_onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='publisherName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Nhà xuất bản</FormLabel>
                  <FormControl>
                    <Input placeholder='Tên Nhà xuất bản' {...field} />
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
                  <FormLabel>Email Nhà Xuất Bản</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập email nhà xuất bản' {...field} />
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
                    <Input placeholder='Nhập số điện thoại' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Email người phụ trách</FormLabel>
              <div className='flex gap-2'>
                <Input
                  placeholder='Nhập email của người phụ trách'
                  disabled={isWorking}
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className='flex-grow'
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={validateManagerEmail}
                  disabled={isWorking || !userEmail.trim()}
                >
                  Xác thực
                </Button>
              </div>
              {managerId && (
                <p className='mt-1 text-sm text-green-600'>
                  Đã tìm thấy tài khoản
                </p>
              )}
            </div>

            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập địa chỉ' {...field} />
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
                    <Input placeholder='Nhập mô tả' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='website'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input type='url' placeholder='Nhập website' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Ảnh chính */}
            <FormField
              control={form.control}
              name='mainImageFile'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ảnh chính</FormLabel>
                  <FormControl>
                    <div className='space-y-2'>
                      <Input
                        type='file'
                        accept='image/*'
                        disabled={isWorking}
                        ref={field.ref}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleMainFileChange(file);
                            field.onChange(file);
                          }
                        }}
                        className='cursor-pointer'
                      />{' '}
                      {previewMainImage && (
                        <div className='relative h-64 w-64 overflow-hidden rounded-md border'>
                          <Image
                            src={previewMainImage}
                            alt='main image preview'
                            width={200}
                          />
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
                  </FormControl>
                  <FormDescription>
                    Yêu cầu upload ảnh 600x600 px
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ảnh bổ sung */}
            <FormField
              control={form.control}
              name='additionalImageFiles'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ảnh bổ sung</FormLabel>
                  <FormControl>
                    <div className='space-y-2'>
                      <Input
                        type='file'
                        multiple
                        accept='image/*'
                        onChange={(e) => {
                          const fileList = e.target.files;
                          if (fileList && fileList.length > 0) {
                            const filesArray = Array.from(fileList) as File[];
                            handleAdditionalFilesChange(filesArray);
                            field.onChange(filesArray);
                          }
                        }}
                        disabled={isWorking}
                      />
                      {previewAdditionalFiles.length > 0 && (
                        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
                          {previewAdditionalFiles.map((url, index) => (
                            <div
                              key={index}
                              className='relative aspect-square w-full overflow-hidden rounded-md border'
                            >
                              <Image
                                src={url}
                                alt={`Preview ${index + 1}`}
                                width={200}
                              />
                              <Button
                                type='button'
                                variant='destructive'
                                size='icon'
                                className='absolute right-2 top-2 h-8 w-8 rounded-full'
                                onClick={() => removeAdditionalImage(index)}
                              >
                                <X className='h-4 w-4' />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {files.additionalFiles.length > 0 && (
                    <div className='mt-2'>
                      <p className='text-sm font-medium'>
                        Đã chọn {files.additionalFiles.length} file:
                      </p>
                      <ul className='mt-1 list-disc pl-5 text-sm text-muted-foreground'>
                        {files.additionalFiles.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nút submit */}
            <div className='mt-6 flex items-center justify-end gap-4'>
              <CancelButton
                _isPending={isWorking}
                routerReplace
                pathUrl={PATH.PUBLISHERS}
              />
              <Button
                type='submit'
                variant={'darker'}
                disabled={isWorking || (userEmail.trim() !== '' && !managerId)}
              >
                {isWorking
                  ? 'Đang xử lý...'
                  : publisher
                    ? 'Cập nhật'
                    : 'Tạo mới'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PublisherForm;
