'use client';

import { PATH } from '@/enums/path';
import { BookFormValues } from '@/lib/zod';
import { bookService } from '@/services/bookService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';

export const useBookMutations = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const createBookMutation = useMutation({
    mutationFn: (data: BookFormValues) => bookService.create(data),
    onSuccess: (data) => {
      if (data?.isSuccess) {
        toast({
          title: 'Thêm mới thành công',
          description: 'Sách đã được thêm vào hệ thống',
          variant: 'success',
        });
        router.push(PATH.BOOKS);
      }
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Không thể lưu thông tin sách. Vui lòng thử lại',
        variant: 'destructive',
      });
      console.error('Error:', error);
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: (data: BookFormValues) => bookService.update(data),
    onSuccess: (data) => {
      if (data?.isSuccess) {
        toast({
          title: 'Cập nhật thành công',
          description: 'Thông tin sách đã được cập nhật',
          variant: 'success',
        });
        router.push(`${PATH.BOOKS}`);
      }
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: (id: string) => bookService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  return {
    createBookMutation,
    updateBookMutation,
    deleteBookMutation,
  };
};
