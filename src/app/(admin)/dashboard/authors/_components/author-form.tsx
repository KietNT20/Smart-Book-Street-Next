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
import { Textarea } from '@/components/ui/textarea';
import { PATH } from '@/enums/path';
import { useAuthorMutation, useGetAuthorById } from '@/hooks/use-author';
import { authorFormSchema, AuthorFormValues } from '@/lib/zod';
import { Author } from '@/types/author-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import AuthorSubmitBtn from './author-submit-btn';

type AuthorData = {
  result: Author;
};

type Props = {
  authorId?: string;
};

export function AuthorForm({ authorId }: Props) {
  const router = useRouter();
  const { createAuthor, updateAuthor } = useAuthorMutation();
  const { data: authorData, isLoading: isLoadingAuthor } =
    useGetAuthorById<AuthorData>(authorId || '');

  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: {
      authorName: '',
      nationality: '',
      biography: ''
    }
  });

  useEffect(() => {
    if (authorData) {
      form.reset({
        authorName: authorData.result.authorName,
        dob: authorData.result.dob as string,
        nationality: authorData.result.nationality,
        biography: authorData.result.biography
      });
    }
  }, [authorData, form]);

  const onSubmit = async (data: AuthorFormValues) => {
    try {
      if (authorId) {
        await updateAuthor.mutateAsync({
          id: authorId,
          ...data,
          biography: data.biography ?? ''
        });
        toast.success('Cập nhật tác giả thành công');
      } else {
        await createAuthor.mutateAsync({
          ...data
        });
      }
      router.push(PATH.AUTHORS);
    } catch (error: unknown) {
      console.error('Error author submit:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  if (authorId && isLoadingAuthor) {
    return <div>Đang tải...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-3 gap-4'>
          <FormField
            control={form.control}
            name='authorName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên tác giả</FormLabel>
                <FormControl>
                  <Input placeholder='Nhập tên tác giả' {...field} />
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
                <FormLabel>Ngày sinh</FormLabel>
                <FormControl>
                  <Input placeholder='Nhập ngày sinh' type='date' {...field} />
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
        </div>

        <FormField
          control={form.control}
          name='biography'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiểu sử</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Nhập tiểu sử tác giả'
                  className='min-h-[120px]'
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
            onClick={() => router.push(PATH.AUTHORS)}
          >
            Hủy
          </Button>
          <AuthorSubmitBtn
            authorId={authorId}
            _onPending={createAuthor.isPending || updateAuthor.isPending}
          />
        </div>
      </form>
    </Form>
  );
}
