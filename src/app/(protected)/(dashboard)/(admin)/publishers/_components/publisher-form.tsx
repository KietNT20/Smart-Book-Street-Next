'use client';

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
import { usePublisherMutation } from '@/hooks/use-publisher';
import { publisherFormSchema, PublisherFormValues } from '@/lib/zod';
import { Publisher } from '@/types/publisher-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FileState = {
  mainFile: File | null;
  additionalFiles: File[];
};

type Props = {
  publisher?: Publisher;
};

const PublisherForm = ({ publisher }: Props) => {
  const [files, setFiles] = useState<FileState>({
    mainFile: null,
    additionalFiles: [],
  });
  const {
    createPublisher,
    createPublisherPending,
    updatePublisher,
    updatePublisherPending,
  } = usePublisherMutation();

  const isWorking = createPublisherPending || updatePublisherPending;
  const router = useRouter();

  const form = useForm<PublisherFormValues>({
    resolver: zodResolver(publisherFormSchema),
    defaultValues: {
      publisherName: '',
      phone: '',
      email: '',
      managerId: '',
      address: '',
      description: '',
      website: '',
      mainImageFile: undefined,
      additionalImageFiles: [],
    },
  });

  function _onSubmit(values: PublisherFormValues) {
    const formData = new FormData();
    if (values.publisherName) {
      formData.append('PublisherName', values.publisherName);
    }

    if (values.phone) {
      formData.append('Phone', values.phone);
    }

    if (values.email) {
      formData.append('Email', values.email);
    }

    if (values.managerId) {
      formData.append('ManagerId', values.managerId);
    }

    if (values.address) {
      formData.append('Address', values.address);
    }

    if (values.description) {
      formData.append('Description', values.description);
    }

    if (values.website) {
      formData.append('Website', values.website);
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

    if (publisher?.id) {
      updatePublisher(
        {
          id: publisher.id,
          formData,
        },
        {
          onSuccess: (data) => {
            if (data) {
              router.push(`${PATH.PUBLISHERS}/${data.result.id}`);
            }
          },
        }
      );
    } else {
      createPublisher(formData, {
        onSuccess: (data) => {
          if (data) {
            router.push(PATH.PUBLISHERS);
          }
        },
      });
    }
  }

  const handleMainFileChange = (file: File | null) => {
    setFiles((prev) => ({ ...prev, mainFile: file }));
  };

  const handleAdditionalFilesChange = (newFiles: File[]) => {
    setFiles((prev) => ({ ...prev, additionalFiles: newFiles }));
  };

  return (
    <div>
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
                  <Input placeholder='Nhập email' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='managerId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Người phụ trách</FormLabel>
                <FormControl>
                  <Input placeholder='Nhập người phụ trách' {...field} />
                </FormControl>
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
                  <Input placeholder='Nhập địa chỉ' {...field} />
                </FormControl>
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
                  <Input
                    type='file'
                    accept='image/*'
                    disabled={isWorking}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleMainFileChange(file);
                        field.onChange(file);
                      }
                    }}
                  />
                </FormControl>
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
                </FormControl>
                {files.additionalFiles.length > 0 && (
                  <div className='mt-2'>
                    <p className='text-sm font-medium'>
                      Đã chọn {files.additionalFiles.length} file:
                    </p>
                    <ul className='mt-1 list-disc pl-5 text-sm text-gray-500'>
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
        </form>
      </Form>
    </div>
  );
};

export default PublisherForm;
