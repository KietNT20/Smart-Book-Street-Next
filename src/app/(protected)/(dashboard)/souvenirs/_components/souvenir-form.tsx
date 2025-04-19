import { Button } from '@/components/ui/button';
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

    formData.append('souvenirName', data.souvenirName);
    formData.append('price', data.price.toString());
    if (data.description) {
      formData.append('description', data.description);
    }

    if (data.baseImgFile instanceof File) {
      formData.append('baseImgFile', data.baseImgFile);
    }

    if (data.otherImgFiles && data.otherImgFiles.length > 0) {
      data.otherImgFiles.forEach((file, index) => {
        if (file instanceof File) {
          formData.append(`otherImgFiles[${index}]`, file);
        }
      });
    }

    // TODO: Gọi API để submit form data
    // fetch('/api/souvenirs', {
    //   method: 'POST',
    //   body: formData,
    // });
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
                    <Input placeholder='Nhập tên quà lưu niệm' {...field} />
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
              <Button type='button' variant='outline'>
                Hủy
              </Button>
              <Button type='submit'>
                {souvenirToEdit ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SouvenirForm;
