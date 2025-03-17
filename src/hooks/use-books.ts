'use client';

import { PATH } from '@/enums/path';
import { bookService } from '@/services/bookService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useBookMutations = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createBookMutation = useMutation({
    mutationKey: ['createBook'],
    mutationFn: (formData: FormData) => bookService.create(formData),
    onSuccess: (data) => {
      if (data?.isSuccess) {
        toast.success('Thêm sách thành công');
        router.push(PATH.BOOKS);
      }
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error: Error) => {
      toast.error('Đã xảy ra lỗi khi thêm sách');
      console.error('Error:', error);
    }
  });

  const updateBookMutation = useMutation({
    mutationKey: ['updateBook'],
    mutationFn: (formData: FormData) => bookService.update(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });

  const deleteBookMutation = useMutation({
    mutationKey: ['deleteBook'],
    mutationFn: (id: string) => bookService.delete(id),
    onSuccess: () => {
      toast.success('Đã xóa sách');
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });

  return {
    createBookMutation,
    updateBookMutation,
    deleteBookMutation
  };
};
