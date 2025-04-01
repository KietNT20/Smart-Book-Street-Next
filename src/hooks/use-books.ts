import { PATH } from '@/enums/path';
import { bookService } from '@/services/bookService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useBookMutations = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createBookMutation = useMutation({
    mutationKey: ['create-book'],
    mutationFn: (formData: FormData) => bookService.create(formData),
    onSuccess: (data) => {
      if (data?.isSuccess) {
        toast.success('Thêm sách thành công');
        router.push(PATH.ADMIN_BOOKS);
      }
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error: Error) => {
      toast.error('Đã xảy ra lỗi khi thêm sách');
      console.error('Error add book:', error);
    }
  });

  const updateBookMutation = useMutation({
    mutationKey: ['update-book'],
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => {
      console.log('Calling update API with id:', id);
      return bookService.update(id, formData);
    },
    onSuccess: (data) => {
      if (data?.isSuccess) {
        toast.success('Cập nhật sách thành công');
        router.push(`${PATH.ADMIN_BOOKS}/${data?.result.id}`);
      }
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error: Error) => {
      toast.error('Đã xảy ra lỗi khi cập nhật sách');
      console.error('Error updating book:', error);
    }
  });

  const deleteBookMutation = useMutation({
    mutationKey: ['delete-book'],
    mutationFn: (id: string) => bookService.delete(id),
    onSuccess: () => {
      toast.success('Đã xóa sách');
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });

  return {
    // Create Book
    createBook: createBookMutation.mutate,
    createBookPending: createBookMutation.isPending,
    // Update Book
    updateBook: updateBookMutation.mutate,
    updateBookPending: updateBookMutation.isPending,
    // Delete Book
    deleteBook: deleteBookMutation.mutate,
    deleteBookPending: deleteBookMutation.isPending
  };
};
