'use client';

import { bookService } from '@/services/bookService';
import { BookSearchPayload } from '@/types/book-types';
import { useQuery } from '@tanstack/react-query';

export const useBookSearch = (params: BookSearchPayload) => {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => bookService.search(params),
  });
};
