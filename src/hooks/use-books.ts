import { bookService } from '@/services/bookService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useBookMutations = () => {
  const queryClient = useQueryClient();

  const createBookMutation = useMutation({
    mutationKey: ['create-book'],
    mutationFn: (formData: FormData) => bookService.create(formData),
    onSuccess: (data) => {
      if (data?.isSuccess) {
        toast.success('Thêm sách thành công');
        queryClient.invalidateQueries({ queryKey: ['books'] });
      }
    },
    onError: (error) => {
      toast.error('Đã xảy ra lỗi khi thêm sách');
      console.error('Error creating book:', error);
    },
  });

  const updateBookMutation = useMutation({
    mutationKey: ['update-book'],
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => {
      return bookService.update(id, formData);
    },
    onSuccess: (data) => {
      if (data?.isSuccess) {
        toast.success('Cập nhật sách thành công');
        queryClient.invalidateQueries({ queryKey: ['books'] });
      }
    },
    onError: (error) => {
      toast.error('Đã xảy ra lỗi khi cập nhật sách');
      console.error('Error updating book:', error);
    },
  });

  const deleteBookMutation = useMutation({
    mutationKey: ['delete-book'],
    mutationFn: (id: string) => bookService.delete(id),
    onSuccess: (data) => {
      if (data?.isSuccess) {
        toast.success('Xóa sách thành công');
        queryClient.invalidateQueries({ queryKey: ['books'] });
      }
    },
    onError: (error) => {
      toast.error('Đã xảy ra lỗi khi xóa sách');
      console.error('Error deleting book:', error);
    },
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
    deleteBookPending: deleteBookMutation.isPending,
  };
};
