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
import { PATH } from '@/enums/path';
import { useStoreMutation } from '@/hooks/use-store';
import { storeFormSchema, StoreFormValues } from '@/lib/zod';
import { StoreData } from '@/types/store-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AddressSearch from './address-search';
import ZoneSearch from './zone-search';

type Props = {
  storeToEdit?: StoreData;
};

const StoreForm = ({ storeToEdit }: Props) => {
  const { createStore, updateStore, isCreatingStore, isUpdatingStore } =
    useStoreMutation();
  const router = useRouter();
  const [zoneDialogOpen, setZoneDialogOpen] = useState(false);
  const [selectedZoneName, setSelectedZoneName] = useState('');

  const isWorking = isCreatingStore || isUpdatingStore;

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: storeToEdit || {
      storeName: '',
      address: '',
      phone: '',
      email: '',
      mainImageFile: null,
      additionalImageFiles: [],
      latitude: 0,
      longitude: 0,
      type: '',
      zoneId: '',
    },
  });

  // Thêm hàm xử lý khi người dùng chọn một zone từ ZoneSearch
  const handleSelectZone = (zoneId: string, zoneName: string) => {
    form.setValue('zoneId', zoneId, { shouldValidate: true });
    setSelectedZoneName(zoneName);
    setZoneDialogOpen(false);
  };

  function onSubmit(values: StoreFormValues) {
    try {
      const formData = new FormData();
      formData.append('StoreName', values.storeName);
      formData.append('Address', values.address);

      if (values.phone) {
        formData.append('Phone', values.phone);
      }

      if (values.email) {
        formData.append('Email', values.email);
      }

      if (values.mainImageFile) {
        formData.append(
          'MainImageFile',
          values.mainImageFile instanceof File
            ? values.mainImageFile
            : new Blob([values.mainImageFile])
        );
      }

      if (values.additionalImageFiles) {
        values.additionalImageFiles.forEach((file) => {
          formData.append(
            'AdditionalImageFiles',
            file instanceof File ? file : new Blob([file])
          );
        });
      }

      formData.append('Latitude', values.latitude?.toString() || '0');
      formData.append('Longitude', values.longitude?.toString() || '0');

      if (values.type) {
        formData.append('Type', values.type);
      }

      if (values.zoneId) {
        formData.append('ZoneId', values.zoneId);
      }

      if (storeToEdit) {
        if (!storeToEdit.id) {
          throw new Error('Store ID is missing for update operation');
        }
        updateStore(
          { id: storeToEdit.id, data: formData },
          {
            onSuccess: (data) => {
              if (data) {
                router.replace(PATH.STORES);
                form.reset();
              }
            },
          }
        );
      } else {
        createStore(formData, {
          onSuccess: (data) => {
            if (data) {
              router.replace(PATH.STORES);
              form.reset();
            }
          },
        });
      }

      console.log('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  // Handler for file inputs
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'mainImageFile' | 'additionalImageFiles'
  ) => {
    const files = e.target.files;

    if (!files) return;

    if (fieldName === 'mainImageFile' && files[0]) {
      form.setValue('mainImageFile', files[0], { shouldValidate: true });
    } else if (fieldName === 'additionalImageFiles') {
      const fileArray = Array.from(files);
      form.setValue('additionalImageFiles', fileArray, {
        shouldValidate: true,
      });
    }
  };

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
                        onOpenChange={setZoneDialogOpen}
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
                              Tìm kiếm và chọn khu vực cho cửa hàng của bạn.
                            </DialogDescription>
                          </DialogHeader>
                          <ZoneSearch
                            onSelectZone={handleSelectZone}
                            onClose={() => setZoneDialogOpen(false)}
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
                />
                {form.formState.errors.mainImageFile && (
                  <p className='text-sm text-red-500'>
                    {form.formState.errors.mainImageFile.message?.toString()}
                  </p>
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
                />
                {form.formState.errors.additionalImageFiles && (
                  <p className='text-sm text-red-500'>
                    {form.formState.errors.additionalImageFiles.message?.toString()}
                  </p>
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
            onClick={() => router.push(PATH.STORES)}
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
