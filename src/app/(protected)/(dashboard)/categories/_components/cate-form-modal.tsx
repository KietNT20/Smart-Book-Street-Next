import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { categoryFormSchema, CategoryFormValues } from '@/lib/zod';
import { Loader2 } from 'lucide-react';
import { CategoryCol } from '../columns';

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => void;
  initialData?: CategoryCol | null;
  isSubmitting?: boolean;
}

export function CategoryFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}: CategoryFormProps) {
  const isEditing = !!initialData;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      categoryName: '',
      description: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        categoryName: initialData.categoryName,
        description: initialData.description || '',
      });
    } else {
      form.reset();
    }
  }, [initialData, form]);

  const handleSubmit = (values: CategoryFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4 py-2'
          >
            <FormField
              control={form.control}
              name='categoryName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên danh mục</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nhập tên danh mục'
                      {...field}
                      disabled={isSubmitting}
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
                      placeholder='Nhập mô tả cho danh mục (không bắt buộc)'
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 size-4 animate-spin' />
                    Đang xử lý...
                  </>
                ) : isEditing ? (
                  'Cập nhật'
                ) : (
                  'Thêm mới'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
