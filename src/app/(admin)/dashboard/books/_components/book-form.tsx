import { DatePickerCompVN } from '@/components/date-input/date-picker-custom';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { BookFormValues, bookSchema } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { PublisherCombobox } from './combobox-publisher';

type BookFormProps = {
  book?: BookFormValues;
  onSubmit: (data: BookFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export function BookForm({
  book,
  isLoading,
  onSubmit,
  onCancel,
}: BookFormProps) {
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: book || {
      code: '',
      title: '',
      publicationDate: '',
      price: 0,
      languages: '',
      description: '',
      size: '',
      status: '',
      publisherId: '',
    },
  });

  const handleDateChange = (date: Date, onChange: (value: string) => void) => {
    try {
      // Make sure date is valid
      if (!date || isNaN(date.getTime())) {
        onChange('');
        return;
      }

      // Format date to YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      onChange(formattedDate);
    } catch (error) {
      console.error('Error formatting date:', error);
      onChange('');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Book Code */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Mã sách <span className="text-red-400">*</span>
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

          {/* Publication Date */}
          <FormField
            control={form.control}
            name="publicationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Ngày xuất bản <span className="text-red-400">*</span>
                </FormLabel>
                <FormControl>
                  <div className="block">
                    <DatePickerCompVN
                      startYear={1900}
                      endYear={new Date().getFullYear() + 10}
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) =>
                        handleDateChange(date, field.onChange)
                      }
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Book Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên sách <span className="text-red-400">*</span>
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

          {/* Choose Publisher */}
          <PublisherCombobox name="publisherId" />

          {/* Prices */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá (VNĐ)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
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

          {/* Lang */}
          <FormField
            control={form.control}
            name="languages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Ngôn ngữ <span className="text-red-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className={cn(
                      form.formState.errors.languages && 'border-red-500'
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Size */}
          <FormField
            control={form.control}
            name="size"
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

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Trạng thái <span className="text-red-400">*</span>
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
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
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

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={onCancel}
            className="px-7"
          >
            Hủy
          </Button>
          <Button disabled={isLoading} type="submit" className="px-7">
            {book ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
