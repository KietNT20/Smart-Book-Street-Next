'use client';

import { BookFormValues } from '@/lib/zod';
import { bookService } from '@/services/bookService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useBookMutations = () => {
  const queryClient = useQueryClient();

  const createBookMutation = useMutation({
    mutationFn: (data: BookFormValues) => bookService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: (data: BookFormValues) => bookService.update(data),
    onSuccess: () => {
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
