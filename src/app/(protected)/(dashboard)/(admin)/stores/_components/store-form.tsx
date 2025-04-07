'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useStoreMutation } from '@/hooks/use-store';
import { storeFormSchema, StoreFormValues } from '@/lib/zod';
import { StoreData } from '@/types/store-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import AddressSearch from './address-search';

type Props = {
  storeToEdit?: StoreData;
};

const StoreForm = ({ storeToEdit }: Props) => {
  const { createStore, updateStore, isCreatingStore, isUpdatingStore } =
    useStoreMutation();

  const isWorking = isCreatingStore || isUpdatingStore;

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: storeToEdit || {
      bookStoreName: '',
      address: '',
      phone: '',
      email: '',
      openingTime: '',
      closingTime: '',
      mainImageFile: undefined,
      additionalImageFiles: [],
      latitude: 0,
      longitude: 0,
      type: '',
      managerId: '',
      zoneId: ''
    }
  });

  function onSubmit(values: StoreFormValues) {
    try {
      const formData = new FormData();
      formData.append('BookStoreName', values.bookStoreName);
      formData.append('Address', values.address);

      if (values.phone) {
        formData.append('Phone', values.phone);
      }

      if (values.email) {
        formData.append('Email', values.email);
      }

      if (values.openingTime) {
        formData.append('OpeningTime', values.openingTime);
      }

      if (values.closingTime) {
        formData.append('ClosingTime', values.closingTime);
      }

      if (values.mainImageFile) {
        formData.append(
          'MainImageFile',
          values.mainImageFile instanceof File
            ? values.mainImageFile
            : new Blob([values.mainImageFile]),
          values.mainImageFile instanceof File
            ? values.mainImageFile.name
            : 'main-image'
        );
      }

      values.additionalImageFiles.forEach((file, index) => {
        if (file) {
          formData.append(
            'AdditionalImageFiles',
            file instanceof File ? file : new Blob([file]),
            file instanceof File ? file.name : `additional-image-${index}`
          );
        }
      });

      formData.append('Latitude', values.latitude?.toString() || '0');
      formData.append('Longitude', values.longitude?.toString() || '0');

      if (values.type) {
        formData.append('Type', values.type);
      }

      if (values.managerId) {
        formData.append('ManagerId', values.managerId);
      }

      if (values.zoneId) {
        formData.append('ZoneId', values.zoneId);
      }

      if (storeToEdit) {
        if (!storeToEdit.id) {
          throw new Error('Store ID is missing for update operation');
        }
        updateStore({ id: storeToEdit.id, data: formData });
      } else {
        createStore(formData);
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
        shouldValidate: true
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <FormField
            control={form.control}
            name='bookStoreName'
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
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Địa chỉ'
                    disabled={isWorking}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <AddressSearch form={form} disabled={isWorking} />
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

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Email' disabled={isWorking} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='openingTime'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giờ mở cửa</FormLabel>
                <FormControl>
                  <Input type='time' disabled={isWorking} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='closingTime'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giờ đóng cửa</FormLabel>
                <FormControl>
                  <Input type='time' disabled={isWorking} {...field} />
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
            name='managerId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Quản lý</FormLabel>
                <FormControl>
                  <Input
                    placeholder='ID Quản lý'
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
                <FormLabel>ID Khu vực</FormLabel>
                <FormControl>
                  <Input
                    placeholder='ID Khu vực'
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

        <div className='space-y-4'>
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

        <Button type='submit' disabled={isWorking}>
          {isWorking ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Đang xử lý...
            </>
          ) : storeToEdit ? (
            'Cập nhật cửa hàng'
          ) : (
            'Thêm cửa hàng'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default StoreForm;
