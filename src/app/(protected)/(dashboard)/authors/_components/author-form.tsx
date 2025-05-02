'use client';

import CancelButton from '@/components/back-btn/cancel-btn';
import SubmitBtn from '@/components/button/submit-btn';
import LoadingSpinner from '@/components/spin/loading-spinner';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { Author } from '@/types/author-types';
import { DatePicker, Image } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { X } from 'lucide-react'; // Import X icon for remove button
import { useAuthorForm } from '../_hooks/use-author-form';

dayjs.locale('vi');

type Props = {
  author?: Author;
  isLoadingAuthor?: boolean;
};

export function AuthorForm({ author, isLoadingAuthor }: Props) {
  const {
    form,
    file,
    isSubmitting,
    fileInputRef,
    onSubmit,
    handleImageFileChange,
    handleRemoveImage,
  } = useAuthorForm({ author });

  if (author?.id && isLoadingAuthor) {
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
                      'h-10 w-full px-3 py-2',
                      form.formState.errors.dob && 'border-red-500'
                    )}
                    onBlur={field.onBlur}
                    disabled={isSubmitting}
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
                  <Input
                    placeholder='Nhập quốc tịch'
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
            name='imgFile'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ảnh</FormLabel>
                <FormControl>
                  <div className='space-y-2'>
                    <Input
                      type='file'
                      accept='image/*'
                      placeholder='Chọn ảnh'
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
                      disabled={isSubmitting}
                      ref={fileInputRef}
                    />

                    {file.previewUrl && (
                      <div className='relative mt-2'>
                        <div className='group relative flex items-center justify-center border'>
                          <Image
                            src={file.previewUrl}
                            alt='Ảnh xem trước'
                            width={200}
                          />
                          <Button
                            type='button'
                            variant='destructive'
                            size='icon'
                            className='absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full'
                            onClick={handleRemoveImage}
                            disabled={isSubmitting}
                          >
                            <X className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Yêu cầu upload ảnh 600x600 px.
                </FormDescription>
                {file.imgFile && (
                  <div className='mt-1 text-sm text-muted'>
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
                <Textarea
                  placeholder='Nhập tiểu sử tác giả'
                  className={cn(
                    'min-h-60',
                    form.formState.errors.biography && 'border-red-500'
                  )}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end gap-4'>
          <CancelButton
            _isPending={isSubmitting}
            routerReplace
            pathUrl={PATH.ADMIN_AUTHORS}
          />
          <SubmitBtn ID={author?.id} _onPending={isSubmitting} />
        </div>
      </form>
    </Form>
  );
}
