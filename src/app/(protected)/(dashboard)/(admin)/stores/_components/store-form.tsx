'use client';

import SubmitBtn from '@/components/button/submit-btn';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { StoreData } from '@/types/store-types';
import { Image } from 'antd';
import { X } from 'lucide-react';
import { useStoreForm } from '../_hooks/use-store-form';
import AddressSearch from './address-search';
import ZoneSearch from './zone-search';

type Props = {
  storeToEdit?: StoreData;
};

const StoreForm = ({ storeToEdit }: Props) => {
  const {
    form,
    isWorking,
    zoneDialogOpen,
    selectedZoneName,
    previewMainImage,
    previewAdditionalImages,
    handleSelectZone,
    toggleZoneDialog,
    onSubmit,
    handleFileChange,
    mainImageInputRef,
    additionalImagesInputRef,
    handleRemoveMainImage,
    handleRemoveAdditionalImage,
    handleCancel,
  } = useStoreForm({ storeToEdit });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        {/* Infomation */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='storeName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên cửa hàng</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Tên cửa hàng sách'
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
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại cửa hàng</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Loại cửa hàng'
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
                name='zoneId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Khu vực</FormLabel>
                    <div className='flex items-center gap-2'>
                      <Dialog
                        open={zoneDialogOpen}
                        onOpenChange={toggleZoneDialog}
                      >
                        <DialogTrigger asChild>
                          <Button
                            type='button'
                            variant='outline'
                            disabled={isWorking}
                          >
                            Tìm khu vực
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='sm:max-w-md'>
                          <DialogHeader>
                            <DialogTitle>Chọn Khu Vực Cửa Hàng</DialogTitle>
                            <DialogDescription>
                              Tìm kiếm khu vực cho cửa hàng của bạn theo tên
                              Đường Sách
                            </DialogDescription>
                          </DialogHeader>
                          <ZoneSearch
                            onSelectZone={handleSelectZone}
                            onClose={toggleZoneDialog}
                          />
                        </DialogContent>
                      </Dialog>

                      {selectedZoneName && (
                        <div className='ml-2 py-1'>
                          Đã chọn: {selectedZoneName}
                        </div>
                      )}
                      <input type='hidden' {...field} />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Address and Location */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Địa chỉ và vị trí</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-6'>
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='col-span-1'>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Địa chỉ cửa hàng'
                        disabled={isWorking}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <AddressSearch form={form} disabled={isWorking} />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='latitude'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vĩ độ</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Vĩ độ'
                          disabled={isWorking}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='longitude'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kinh độ</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Kinh độ'
                          disabled={isWorking}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Email'
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
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Số điện thoại'
                        disabled={isWorking}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Images Store */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Hình ảnh cửa hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              <div>
                <FormLabel>Ảnh chính</FormLabel>
                <Input
                  type='file'
                  accept='image/*'
                  onChange={(e) => handleFileChange(e, 'mainImageFile')}
                  disabled={isWorking}
                  className='mb-2'
                  ref={mainImageInputRef}
                />
                {form.formState.errors.mainImageFile && (
                  <p className='mb-2 text-sm text-red-500'>
                    {form.formState.errors.mainImageFile.message?.toString()}
                  </p>
                )}

                {/* Preview ảnh chính */}
                {previewMainImage && (
                  <div className='relative flex h-72 items-center justify-center overflow-hidden rounded-md border'>
                    <Image
                      src={previewMainImage}
                      alt='main image preview'
                      height={275}
                      className='object-cover'
                    />
                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
                      className='absolute right-2 top-2 h-8 w-8 rounded-full'
                      onClick={handleRemoveMainImage}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <FormLabel>Ảnh bổ sung</FormLabel>
                <Input
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={(e) => handleFileChange(e, 'additionalImageFiles')}
                  disabled={isWorking}
                  className='mb-2'
                  ref={additionalImagesInputRef}
                />
                {form.formState.errors.additionalImageFiles && (
                  <p className='mb-2 text-sm text-red-500'>
                    {form.formState.errors.additionalImageFiles.message?.toString()}
                  </p>
                )}

                {/* Preview ảnh bổ sung */}
                {previewAdditionalImages.length > 0 && (
                  <div className='mt-2 grid grid-cols-2 gap-4 md:grid-cols-3'>
                    {previewAdditionalImages.map((url, index) => (
                      <div
                        key={index}
                        className='relative flex aspect-video items-center overflow-hidden rounded-md border'
                      >
                        <Image
                          src={url}
                          alt={`Preview ${index + 1}`}
                          height={275}
                          className='h-full w-full object-cover'
                        />
                        <Button
                          type='button'
                          variant='destructive'
                          size='icon'
                          className='absolute right-2 top-2 h-8 w-8 rounded-full'
                          onClick={() => handleRemoveAdditionalImage(index)}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='flex items-center justify-end gap-4'>
          <Button
            type='button'
            variant='outline'
            disabled={isWorking}
            onClick={handleCancel}
            className='px-7'
          >
            Hủy
          </Button>
          <SubmitBtn ID={storeToEdit?.id} _onPending={isWorking} />
        </div>
      </form>
    </Form>
  );
};

export default StoreForm;
