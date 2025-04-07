import RichTextEditor from '@/components/rich-text-editor';
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
import { useBookMutations } from '@/hooks/use-books';
import useDebounce from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { BookFormValues, bookSchema } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import AuthorCombobox from '../../_components/author-combobox';
import CategoryCombobox from '../../_components/category-combobox';
import PublisherCombobox from '../../_components/publisher-combobox';
import { prepareInitialBookData } from '../_lib/book-form-helpers';
import { useBookFormSubmit } from '../_lib/use-book-form-submit';
import BookPublicationDate from './book-publication-date';

type Props = {
  book?: BookFormValues;
  onCancel: () => void;
};

const BookForm = ({ book, onCancel }: Props) => {
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: prepareInitialBookData(book)
  });
  const { createBook, createBookPending, updateBook, updateBookPending } =
    useBookMutations();
  const isLoading = useDebounce(createBookPending || updateBookPending, 300);
  const router = useRouter();

  const onSubmit = (formData: FormData) => {
    if (book) {
      updateBook(
        { id: book.id!, formData },
        {
          onSuccess: () => {
            form.reset();
            router.push(`${PATH.ADMIN_BOOKS}/${book.id}`);
          }
        }
      );
    } else {
      createBook(formData, {
        onSuccess: () => {
          form.reset();
        }
      });
    }
  };

  const {
    files,
    handleMainFileChange,
    handleAdditionalFilesChange,
    handleSubmit
  } = useBookFormSubmit(onSubmit);

  return (
    <Form {...form}>
      <form
        action='#'
        onSubmit={form.handleSubmit((values) => handleSubmit(values))}
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
                    placeholder='Nhập mã sách'
                    disabled={isLoading}
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
                    placeholder='Nhập ngôn ngữ'
                    disabled={isLoading}
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
                    placeholder='Nhập trạng thái'
                    disabled={isLoading}
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
                    accept='image/*'
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
                    className={cn(
                      form.formState.errors.additionalImageFiles &&
                        'border-red-500'
                    )}
                    disabled={isLoading}
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
        </div>

        {/* Mô tả */}
        {/* <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder='Nhập mô tả' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
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
          <Button
            type='button'
            variant='outline'
            disabled={isLoading}
            onClick={onCancel}
            className='px-7'
          >
            Hủy
          </Button>
          <Button type='submit' disabled={isLoading} className='px-7'>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Đang xử lý...
              </>
            ) : book ? (
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
