'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { PATH } from '@/enums/path';
import { useStreetMutation } from '@/hooks/use-street';
import { streetFormSchema, StreetFormValues } from '@/lib/zod';
import { Street } from '@/types/street-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AddressSearch from './address-search';

type Props = {
  initialData?: Street;
  mode?: 'create' | 'update';
  onCancel?: () => void;
};

const StreetForm = ({ initialData, mode = 'create', onCancel }: Props) => {
  const [baseImagePreview, setBaseImagePreview] = useState<string | null>(null);
  const [otherImagesPreview, setOtherImagesPreview] = useState<string[]>([]);
  const router = useRouter();

  const {
    createStreet,
    createStreetLoading,
    updateStreet,
    updateStreetLoading,
  } = useStreetMutation();

  const isSubmitting = createStreetLoading || updateStreetLoading;

  const form = useForm<StreetFormValues>({
    resolver: zodResolver(streetFormSchema),
    defaultValues: {
      streetName: initialData?.streetName || '',
      address: initialData?.address || '',
      description: initialData?.description || '',
      latitude: initialData?.latitude || 0,
      longitude: initialData?.longitude || 0,
      baseImgFile: null,
      otherImgFiles: [],
    },
  });

  const handleBaseImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        form.setError('baseImgFile', {
          type: 'manual',
          message: 'Ảnh chính không được vượt quá 10MB',
        });
        return;
      }

      const acceptedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ];
      if (!acceptedTypes.includes(file.type)) {
        form.setError('baseImgFile', {
          type: 'manual',
          message: 'Ảnh chính chỉ chấp nhận định dạng JPEG, PNG, WebP',
        });
        return;
      }

      form.setValue('baseImgFile', file);
      form.clearErrors('baseImgFile');
      const reader = new FileReader();
      reader.onload = (e) => {
        setBaseImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOtherImagesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    const currentFiles = form.getValues('otherImgFiles') || [];

    if (currentFiles.length + files.length > 10) {
      form.setError('otherImgFiles', {
        type: 'manual',
        message: 'Chỉ được tải lên tối đa 10 ảnh khác',
      });
      return;
    }

    // Validate each file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const acceptedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    for (const file of files) {
      if (file.size > maxSize) {
        form.setError('otherImgFiles', {
          type: 'manual',
          message: `File "${file.name}" vượt quá 5MB`,
        });
        return;
      }

      if (!acceptedTypes.includes(file.type)) {
        form.setError('otherImgFiles', {
          type: 'manual',
          message: `File "${file.name}" không đúng định dạng cho phép`,
        });
        return;
      }
    }

    const newFiles = [...currentFiles, ...files];
    form.setValue('otherImgFiles', newFiles);
    form.clearErrors('otherImgFiles');

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOtherImagesPreview((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeOtherImage = (index: number) => {
    const currentFiles = form.getValues('otherImgFiles') || [];
    const newFiles = currentFiles.filter((_, i) => i !== index);
    form.setValue('otherImgFiles', newFiles);

    setOtherImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const removeBaseImage = () => {
    form.setValue('baseImgFile', null);
    setBaseImagePreview(null);
    form.clearErrors('baseImgFile');
  };

  const onSubmit = (data: StreetFormValues) => {
    const formData = new FormData();
    formData.append('StreetName', data.streetName);
    formData.append('Address', data.address);
    formData.append('Description', data.description);
    formData.append('Latitude', data.latitude.toString());
    formData.append('Longitude', data.longitude.toString());

    if (data.baseImgFile instanceof File && typeof window !== 'undefined') {
      formData.append('BaseImgFile', data.baseImgFile);
    }

    if (
      data.otherImgFiles &&
      data.otherImgFiles.length > 0 &&
      typeof window !== 'undefined'
    ) {
      data.otherImgFiles.forEach((file) => {
        formData.append('OtherImgFiles', file);
      });
    }

    if (mode === 'create') {
      createStreet(formData);
    } else if (initialData?.id) {
      updateStreet({ id: initialData.id, data: formData });
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.replace(PATH.STREETS);
    }
  };

  return (
    <Card className='mx-auto w-full max-w-4xl'>
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Tạo đường phố mới' : 'Cập nhật đường phố'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Basic Information */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='streetName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đường phố *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập tên đường phố'
                        disabled={isSubmitting}
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
                    <FormLabel>Địa chỉ *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nhập địa chỉ'
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Nhập mô tả về đường phố'
                      className='min-h-[100px]'
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address Search Component */}
            <div className='space-y-2'>
              <FormLabel>Tọa độ vị trí *</FormLabel>
              <AddressSearch form={form} disabled={isSubmitting} />
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='latitude'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vĩ độ (Latitude)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='any'
                          placeholder='0.000000'
                          disabled={isSubmitting}
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
                      <FormLabel>Kinh độ (Longitude)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='any'
                          placeholder='0.000000'
                          disabled={isSubmitting}
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

            {/* Base Image Upload */}
            <FormField
              control={form.control}
              name='baseImgFile'
              render={() => (
                <FormItem>
                  <FormLabel>Hình ảnh chính</FormLabel>
                  <FormControl>
                    <div className='rounded-lg border-2 border-dashed border-border p-6'>
                      {baseImagePreview ? (
                        <div className='relative'>
                          <Image
                            src={baseImagePreview}
                            alt='Base preview'
                            width={800}
                            height={192}
                            className='h-48 w-full rounded-lg object-cover'
                          />
                          <Button
                            type='button'
                            variant='destructive'
                            size='sm'
                            className='absolute right-2 top-2'
                            onClick={removeBaseImage}
                            disabled={isSubmitting}
                          >
                            <X className='h-4 w-4' />
                          </Button>
                        </div>
                      ) : (
                        <div className='text-center'>
                          <Upload className='mx-auto h-12 w-12 text-muted-foreground' />
                          <div className='mt-4'>
                            <label htmlFor='base-image-upload'>
                              <span className='inline-flex cursor-pointer items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90'>
                                Chọn hình ảnh chính
                              </span>
                            </label>
                            <input
                              id='base-image-upload'
                              type='file'
                              accept='image/*'
                              onChange={handleBaseImageChange}
                              className='hidden'
                              disabled={isSubmitting}
                            />
                          </div>
                          <p className='mt-2 text-sm text-muted-foreground'>
                            PNG, JPG, WebP, GIF tối đa 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Other Images Upload */}
            <FormField
              control={form.control}
              name='otherImgFiles'
              render={() => (
                <FormItem>
                  <FormLabel>Hình ảnh khác</FormLabel>
                  <FormControl>
                    <div className='space-y-4'>
                      {otherImagesPreview.length > 0 && (
                        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                          {otherImagesPreview.map((preview, index) => (
                            <div key={index} className='relative'>
                              <Image
                                src={preview}
                                alt={`Other preview ${index + 1}`}
                                width={200}
                                height={128}
                                className='h-32 w-full rounded-lg object-cover'
                              />
                              <Button
                                type='button'
                                variant='destructive'
                                size='sm'
                                className='absolute right-1 top-1'
                                onClick={() => removeOtherImage(index)}
                                disabled={isSubmitting}
                              >
                                <X className='h-3 w-3' />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className='rounded-lg border-2 border-dashed border-border p-4'>
                        <div className='text-center'>
                          <label htmlFor='other-images-upload'>
                            <span className='inline-flex cursor-pointer items-center rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground'>
                              <Plus className='mr-2 h-4 w-4' />
                              Thêm hình ảnh
                            </span>
                          </label>
                          <input
                            id='other-images-upload'
                            type='file'
                            accept='image/*'
                            multiple
                            onChange={handleOtherImagesChange}
                            className='hidden'
                            disabled={isSubmitting}
                          />
                        </div>
                        <p className='mt-2 text-center text-xs text-muted-foreground'>
                          PNG, JPG, WebP, GIF tối đa 5MB/ảnh, tối đa 10 ảnh
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className='flex justify-end space-x-4 border-t pt-6'>
              <Button
                type='button'
                variant='outline'
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='w-full md:w-auto'
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    {mode === 'create' ? 'Đang tạo...' : 'Đang cập nhật...'}
                  </>
                ) : mode === 'create' ? (
                  'Tạo đường phố'
                ) : (
                  'Cập nhật đường phố'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default StreetForm;
