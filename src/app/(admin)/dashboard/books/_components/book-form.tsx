import { DatePickerV1 } from '@/components/date-picker/date-picker-v1';
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
import { cn } from '@/lib/utils';
import { BookFormValues, bookSchema } from '@/lib/zod';
import { BookAuthorIds, BookCategoryIds } from '@/types/book-types';
import { Publisher } from '@/types/publisher-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parse } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthorCombobox from '../../_components/author-combobox';
import CategoryCombobox from '../../_components/category-combobox';
import PublisherCombobox from '../../_components/publisher-combobox';
import BookSubmitBtn from './book-submit-btn';

interface BookWithRelations extends BookFormValues {
  publiser: Publisher;
  bookAuthors?: BookAuthorIds[];
  bookCategories?: BookCategoryIds[];
}

type Props = {
  book?: BookFormValues;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

const BookForm = ({ book, isLoading, onSubmit, onCancel }: Props) => {
  const [files, setFiles] = useState({
    mainFile: null as File | null,
    additionalFiles: [] as File[]
  });

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: book
      ? {
          ...book,
          publicationDate: format(new Date(book.publicationDate), 'yyyy-MM-dd'),
          publisherId: (book as BookWithRelations).publisherId,
          authorIds:
            (book as BookWithRelations).bookAuthors?.map(
              (ba: BookAuthorIds) => ba.authorId
            ) || [],
          categoryIds:
            (book as BookWithRelations).bookCategories?.map(
              (bc: BookCategoryIds) => bc.categoryId
            ) || []
        }
      : {
          code: '',
          title: '',
          publicationDate: '',
          price: 0,
          languages: '',
          description: '',
          size: '',
          status: '',
          publisherId: '',
          authorIds: [],
          categoryIds: [],
          mainImageFile: undefined,
          additionalImageFiles: []
        }
  });

  const getPublicationDate = (): Date | undefined => {
    const dateStr = form.getValues('publicationDate');
    if (!dateStr) return undefined;

    try {
      return parse(dateStr, 'yyyy-MM-dd', new Date());
    } catch (error) {
      console.error('Error parsing date:', error);
      return undefined;
    }
  };

  const handleSubmitForm = async (values: Partial<BookFormValues>) => {
    try {
      const formData = new FormData();

      formData.append('Code', values.code || '');
      formData.append('Title', values.title || '');
      formData.append('PublicationDate', values.publicationDate || '');
      formData.append('Price', (values.price ?? 0).toString());
      formData.append('Languages', values.languages || '');
      formData.append('Description', values.description || '');
      formData.append('Size', values.size || '');
      formData.append('Status', values.status || '');
      formData.append('PublisherId', values.publisherId || '');
      if (values.authorIds) {
        values.authorIds.forEach((authorId) =>
          formData.append('AuthorIds', authorId)
        );
      }
      if (values.categoryIds) {
        values.categoryIds.forEach((categoryId) =>
          formData.append('CategoryIds', categoryId)
        );
      }

      if (files.mainFile) {
        console.log('Main file:', files.mainFile);
        formData.append('MainImageFile', files.mainFile);
      }

      files.additionalFiles.forEach((file) => {
        formData.append('AdditionalImageFiles', file);
      });

      onSubmit(formData);
    } catch (error) {
      console.error('Error preparing form data:', error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className='space-y-4'
      >
        <div className='grid grid-cols-2 gap-4'>
          {/* Mã sách */}
          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Mã sách <span className='text-red-400'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className={cn(
                      form.formState.errors.code && 'border-red-500'
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ngày xuất bản - use DatePickerV1 */}
          <FormField
            control={form.control}
            name='publicationDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Ngày xuất bản <span className='text-red-400'>*</span>
                </FormLabel>
                <FormControl>
                  <DatePickerV1
                    date={getPublicationDate()}
                    setDate={(date) => {
                      if (date) {
                        field.onChange(format(date, 'yyyy-MM-dd'));
                      } else {
                        field.onChange('');
                      }
                    }}
                    placeholder='Chọn ngày xuất bản'
                    className={cn(
                      form.formState.errors.publicationDate && 'border-red-500'
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
          <PublisherCombobox name='publisherId' control={form.control} />

          {/* Giá */}
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá (VNĐ)</FormLabel>
                <FormControl>
                  <Input
                    type='text'
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
          <AuthorCombobox name='authorIds' control={form.control} />

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
                  <Input
                    className={cn(
                      'w-full',
                      form.formState.errors.languages && 'border-red-500'
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Thể loại */}
          <CategoryCombobox name='categoryIds' control={form.control} />

          {/* Kích thước */}
          <FormField
            control={form.control}
            name='size'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kích thước</FormLabel>
                <FormControl>
                  <Input
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

          {/* Trạng thái */}
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Trạng thái <span className='text-red-400'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className={cn(
                      form.formState.errors.status && 'border-red-500'
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFiles((prev) => ({ ...prev, mainFile: file }));
                        field.onChange(file);
                      }
                    }}
                    className={cn(
                      form.formState.errors.mainImageFile && 'border-red-500'
                    )}
                  />
                </FormControl>
                {files.mainFile && (
                  <div className='mt-1 text-sm text-gray-500'>
                    {files.mainFile.name}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                  onChange={(e) => {
                    const fileList = e.target.files;
                    if (fileList && fileList.length > 0) {
                      const filesArray = Array.from(fileList) as File[];
                      setFiles((prev) => ({
                        ...prev,
                        additionalFiles: filesArray
                      }));
                      field.onChange(filesArray);
                    }
                  }}
                  className={cn(
                    form.formState.errors.additionalImageFiles &&
                      'border-red-500'
                  )}
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

        {/* Mô tả */}
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nút điều khiển */}
        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            disabled={isLoading}
            onClick={onCancel}
            className='px-7'
          >
            Hủy
          </Button>
          <BookSubmitBtn book={book} _onPending={isLoading!} />
        </div>
      </form>
    </Form>
  );
};

export default BookForm;
