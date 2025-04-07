'use client';

import RichTextEditor from '@/components/rich-text-editor';
import LoadingSpinner from '@/components/spin/loading-spinner';
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
import { PATH } from '@/enums/path';
import { useAuthorMutation, useGetAuthorById } from '@/hooks/use-author';
import { cn } from '@/lib/utils';
import { authorFormSchema, AuthorFormValues } from '@/lib/zod';
import { Author } from '@/types/author-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import AuthorSubmitBtn from './author-submit-btn';

type AuthorData = {
  result: Author;
};

type FileState = {
  imgFile: File | null;
};

type Props = {
  authorId?: string;
};

export function AuthorForm({ authorId }: Props) {
  const [file, setFile] = useState<FileState>({
    imgFile: null
  });

  const router = useRouter();
  const {
    createAuthor,
    createAuthorPending,
    updateAuthor,
    updateAuthorPending
  } = useAuthorMutation();
  const { data: authorData, isLoading: isLoadingAuthor } =
    useGetAuthorById<AuthorData>(authorId || '');

  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: {
      authorName: '',
      nationality: '',
      biography: '',
      dob: '',
      imgFile: undefined
    }
  });

  useEffect(() => {
    if (authorData) {
      form.reset({
        authorName: authorData.result.authorName,
        dob: authorData.result.dob
          ? dayjs(authorData.result.dob).format('YYYY-MM-DD')
          : '',
        nationality: authorData.result.nationality,
        biography: authorData.result.biography,
        imgFile: undefined
      });
    }
  }, [authorData, form]);

  const onSubmit = (data: AuthorFormValues) => {
    try {
      const formData = new FormData();
      formData.append('AuthorName', data.authorName);
      formData.append('DOB', data.dob || '');
      formData.append('Nationality', data.nationality || '');
      formData.append('Biography', data.biography || '');
      if (data.imgFile) {
        formData.append('ImgFile', data.imgFile);
      }
      if (authorId) {
        updateAuthor({ id: authorId, formData });
      } else if (!authorId) {
        createAuthor(formData);
      }
    } catch (error: unknown) {
      console.error('Error author submit:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleImageFileChange = (file: File | null) => {
    setFile((prev) => ({ ...prev, imgFile: file }));
  };

  if (authorId && isLoadingAuthor) {
    return <LoadingSpinner />;
  }

  return (
    <Form {...form}>
      <form
        action='#'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6'
      >
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='authorName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên tác giả</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Nhập tên tác giả'
                    className={cn(
                      form.formState.errors.authorName && 'border-red-500'
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='dob'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày sinh:</FormLabel>
                <FormControl>
                  <DatePicker
                    format='YYYY-MM-DD'
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date ? date.format('YYYY-MM-DD') : null);
                    }}
                    placeholder='Chọn ngày sinh'
                    className={cn(
                      'w-full px-3 py-2',
                      form.formState.errors.dob && 'border-red-500'
                    )}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='nationality'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quốc tịch</FormLabel>
                <FormControl>
                  <Input placeholder='Nhập quốc tịch' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='imgFile'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ảnh</FormLabel>
                <FormControl>
                  <Input
                    type='file'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageFileChange(file);
                        field.onChange(file);
                      }
                    }}
                    className={cn(
                      form.formState.errors.imgFile && 'border-red-500'
                    )}
                  />
                </FormControl>
                {file.imgFile && (
                  <div className='mt-1 text-sm text-gray-500'>
                    {file.imgFile.name}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='biography'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiểu sử</FormLabel>
              <FormControl>
                <RichTextEditor
                  content={field.value || ''}
                  placeholder='Nhập mô tả chi tiết về sách...'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push(PATH.ADMIN_AUTHORS)}
          >
            Hủy
          </Button>
          <AuthorSubmitBtn
            authorId={authorId}
            _onPending={createAuthorPending || updateAuthorPending}
          />
        </div>
      </form>
    </Form>
  );
}
