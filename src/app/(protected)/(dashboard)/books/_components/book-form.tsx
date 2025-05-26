'use client';

import CancelButton from '@/components/back-btn/cancel-btn';
import AuthorCombobox from '@/components/combobox/author-combobox';
import CategoryCombobox from '@/components/combobox/category-combobox';
import PublisherCombobox from '@/components/combobox/publisher-combobox';
import RichTextEditor from '@/components/rich-text-editor';
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
import { PATH } from '@/enums/path';
import { useBookMutations } from '@/hooks/use-books';
import { cn } from '@/lib/utils';
import { BookFormValues, bookSchema } from '@/lib/zod';
import { Book } from '@/types/book-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { prepareInitialBookData } from '../_lib/book-form-helpers';
import { useBookFormSubmit } from '../_lib/use-book-form-submit';
import BookPublicationDate from './book-publication-date';
import BookSelectLang from './book-select-lang';

dayjs.locale('vi');

type BookFormMode = 'create' | 'edit';

type Props = {
  book?: Book;
  mode: BookFormMode;
};

const BookForm = ({ book, mode }: Props) => {
  const { createBook, createBookPending, updateBook, updateBookPending } =
    useBookMutations();
  const isLoading = createBookPending || updateBookPending;
  const router = useRouter();

  // Create refs for file inputs
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const additionalFilesInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: prepareInitialBookData(book),
  });

  const onSubmit = (formData: FormData) => {
    if (book?.id && mode === 'edit') {
      updateBook(
        { id: book.id, formData },
        {
          onSuccess: () => {
            form.reset();
            router.push(`${PATH.BOOKS}/${book.id}`);
          },
        }
      );
    } else {
      createBook(formData, {
        onSuccess: () => {
          form.reset();
          router.push(PATH.BOOKS);
        },
      });
    }
  };

  const {
    files,
    handleMainFileChange,
    handleAdditionalFilesChange,
    handleRemoveMainImage,
    handleRemoveAdditionalImage,
    handleSubmit,
  } = useBookFormSubmit(onSubmit, book?.images?.[0]?.url);

  useEffect(() => {
    if (book) {
      const values = prepareInitialBookData(book);
      form.reset(values);
    }
  }, [book, form]);

  return (
    <Form {...form}>
      <form
        action='#'
        onSubmit={form.handleSubmit((values) => handleSubmit(values))}
        className='space-y-4'
      >
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          {/* ISPN */}
          <FormField
            control={form.control}
            name='isbn'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  ISBN <span className='text-red-400'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Nhập mã sách'
                    disabled={isLoading}
                    className={cn(
                      form.formState.errors.isbn && 'border-red-500'
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ngày xuất bản  */}
          <BookPublicationDate control={form.control} disabled={isLoading} />

          {/* Tên sách */}
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên sách <span className='text-red-400'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Nhập tên sách'
                    disabled={isLoading}
                    className={cn(
                      form.formState.errors.title && 'border-red-500'
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nhà xuất bản */}
          <PublisherCombobox
            name='publisherId'
            control={form.control}
            description={book?.publisher?.publisherName}
          />

          {/* Giá */}
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá (VNĐ)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Nhập giá'
                    disabled={isLoading}
                    className={cn(
                      form.formState.errors.price && 'border-red-500'
                    )}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tác giả */}
          <AuthorCombobox
            name='authorIds'
            control={form.control}
            description={book?.bookAuthors
              ?.map((item) => item?.authorName)
              .join(', ')}
          />

          {/* Ngôn ngữ */}
          <FormField
            control={form.control}
            name='languages'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Ngôn ngữ <span className='text-red-400'>*</span>
                </FormLabel>
                <FormControl>
                  <BookSelectLang
                    value={field.value!}
                    onValueChange={field.onChange}
                    disabled={false}
                    className={cn(
                      form.formState.errors.languages && 'border-red-500'
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Thể loại */}
          <CategoryCombobox
            name='categoryIds'
            control={form.control}
            description={
              book?.bookCategories
                ?.map((item) => item.categoryName)
                .join(', ') || ''
            }
          />

          {/* Kích thước */}
          <FormField
            control={form.control}
            name='size'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kích thước</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Nhập kích thước'
                    disabled={isLoading}
                    className={cn(
                      form.formState.errors.size && 'border-red-500'
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Ảnh chính */}
        <FormField
          control={form.control}
          name='mainImageFile'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ảnh chính</FormLabel>
              <FormControl>
                <div className='space-y-2'>
                  <Input
                    type='file'
                    accept='image/*'
                    ref={mainFileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleMainFileChange(file);
                        field.onChange(file);
                      }
                    }}
                    className={cn(
                      form.formState.errors.mainImageFile && 'border-red-500'
                    )}
                    disabled={isLoading}
                  />

                  {/* Preview for main image */}
                  {files.mainPreviewUrl && (
                    <div className='relative mt-2'>
                      <div className='group relative flex items-center justify-center border'>
                        <Image
                          src={files.mainPreviewUrl}
                          alt='Ảnh xem trước'
                          width={300}
                          height={275}
                        />
                        <Button
                          type='button'
                          variant='destructive'
                          size='icon'
                          className='absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full'
                          onClick={() => {
                            handleRemoveMainImage(mainFileInputRef);
                            field.onChange(undefined);
                          }}
                          disabled={isLoading}
                        >
                          <X className='size-4' />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Yêu cầu upload ảnh (600x600px, tối đa 5 mb).
              </FormDescription>
              {files.mainFile && (
                <div className='mt-1 text-sm text-zinc-500'>
                  {files.mainFile.name}
                </div>
              )}
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
                <div className='space-y-2'>
                  <Input
                    type='file'
                    multiple
                    accept='image/*'
                    ref={additionalFilesInputRef}
                    onChange={(e) => {
                      const fileList = e.target.files;
                      if (fileList && fileList.length > 0) {
                        const filesArray = Array.from(fileList) as File[];
                        handleAdditionalFilesChange(filesArray);
                        field.onChange(filesArray);
                      }
                    }}
                    className={cn(
                      form.formState.errors.additionalImageFiles &&
                        'border-red-500'
                    )}
                    disabled={isLoading}
                  />

                  {/* Preview for additional images */}
                  {files.additionalPreviewUrls.length > 0 && (
                    <div className='mt-2 grid grid-cols-2 gap-2 lg:grid-cols-4'>
                      {files.additionalPreviewUrls.map((url, index) => (
                        <div
                          key={index}
                          className='group relative flex items-center justify-center border'
                        >
                          <Image src={url} alt={`Ảnh bổ sung ${index + 1}`} />
                          <Button
                            type='button'
                            variant='destructive'
                            size='icon'
                            className='absolute right-0 top-0 -mr-2 -mt-2 flex h-5 w-5 items-center justify-center rounded-full'
                            onClick={() => {
                              handleRemoveAdditionalImage(
                                index,
                                additionalFilesInputRef
                              );
                              const newFiles = [...files.additionalFiles];
                              newFiles.splice(index, 1);
                              field.onChange(
                                newFiles.length > 0 ? newFiles : undefined
                              );
                            }}
                            disabled={isLoading}
                          >
                            <X className='h-3 w-3' />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Yêu cầu upload ảnh (600x600px png, tối đa 5 mb mỗi ảnh, tải tối
                đa 4 hình).
              </FormDescription>
              {files.additionalFiles.length > 0 && (
                <div className='mt-2'>
                  <p className='text-sm font-medium'>
                    Đã chọn {files.additionalFiles.length} file:
                  </p>
                  <ul className='mt-1 list-disc pl-5 text-sm text-zinc-500'>
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

        {/* Mô tả */}
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem className='col-span-2'>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <RichTextEditor
                  content={field.value || ''}
                  onChange={field.onChange}
                  placeholder='Nhập mô tả chi tiết về sách...'
                  className={cn(
                    form.formState.errors.description && 'border-red-500'
                  )}
                  isPending={isLoading}
                  readOnly={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nút điều khiển */}
        <div className='flex justify-end gap-2'>
          <CancelButton
            _isPending={isLoading}
            pathUrl={PATH.BOOKS}
            routerReplace
          />
          <Button type='submit'>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 size-4 animate-spin' />
                Đang xử lý...
              </>
            ) : mode === 'edit' ? (
              'Cập nhật'
            ) : (
              'Thêm mới'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookForm;
