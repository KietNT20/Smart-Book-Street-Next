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
import useDebounce from '@/hooks/use-debounce';
import { useSouvenirMutation } from '@/hooks/use-souvenir';
import { souvenirFormSchema, SouvenirFormValues } from '@/lib/zod';
import { Souvenir } from '@/types/souvenir-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'antd';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  souvenirToEdit?: Souvenir;
};

const SouvenirForm = ({ souvenirToEdit }: Props) => {
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState<
    string[]
  >([]);
  const {
    createSouvenir,
    updateSouvenir,
    isCreatingSouvenir,
    isUpdatingSouvenir,
  } = useSouvenirMutation();
  const isPending = useDebounce(isCreatingSouvenir || isUpdatingSouvenir, 300);

  const form = useForm<SouvenirFormValues>({
    resolver: zodResolver(souvenirFormSchema),
    defaultValues: {
      souvenirName: souvenirToEdit?.souvenirName || '',
      price: souvenirToEdit?.price || 0,
      description: souvenirToEdit?.description || '',
      baseImgFile: souvenirToEdit?.baseImgFile || null,
      otherImgFiles: souvenirToEdit?.otherImgFiles || [],
    },
  });

  const onSubmit = (data: SouvenirFormValues) => {
    const formData = new FormData();

    if (data.souvenirName) {
      formData.append('SouvenirName', data.souvenirName);
    }
    if (data.price) {
      formData.append('Price', data.price.toString());
    }
    if (data.description) {
      formData.append('Description', data.description);
    }

    if (data.baseImgFile instanceof File) {
      formData.append('BaseImgFile', data.baseImgFile);
    }

    if (data.otherImgFiles && data.otherImgFiles.length > 0) {
      data.otherImgFiles.forEach((file) => {
        if (file instanceof File) {
          formData.append(`OtherImgFiles`, file);
        }
      });
    }

    if (souvenirToEdit) {
      updateSouvenir({
        id: souvenirToEdit?.id as string,
        data: formData,
      });
    } else {
      createSouvenir(formData);
    }
  };

  const handleMainImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('baseImgFile', file);
    }
  };

  const handleAdditionalImagesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const filesArray = Array.from(files);

      // Xử lý preview cho các file
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAdditionalImagesPreview((prev) => [
            ...prev,
            reader.result as string,
          ]);
        };
        reader.readAsDataURL(file);
      });

      // Cập nhật form value
      form.setValue('otherImgFiles', filesArray);
    }
  };

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
                        <div className='relative flex h-40 w-40 items-center justify-center overflow-hidden'>
                          <Image
                            src={mainImagePreview}
                            alt='Preview'
                            className='h-full w-full rounded-md object-cover'
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Tải lên ảnh chính cho quà lưu niệm (tùy chọn)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='otherImgFiles'
              render={() => (
                <FormItem>
                  <FormLabel>Ảnh bổ sung</FormLabel>
                  <FormControl>
                    <div className='space-y-4'>
                      <Input
                        type='file'
                        accept='image/*'
                        multiple
                        onChange={handleAdditionalImagesChange}
                        disabled={isPending}
                      />
                      {additionalImagesPreview.length > 0 && (
                        <div className='grid grid-cols-4 gap-4'>
                          {additionalImagesPreview.map((preview, index) => (
                            <div
                              key={index}
                              className='relative flex h-24 w-full items-center justify-center overflow-hidden'
                            >
                              <Image
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className='h-full w-full rounded-md object-cover'
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Tải lên các ảnh bổ sung cho quà lưu niệm (tùy chọn)
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
