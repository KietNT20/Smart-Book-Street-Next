import { bookService } from '@/services/bookService';
import { BookSearchPagination } from '@/types/book-types';
import { useQuery } from '@tanstack/react-query';

export const useBookSearch = (params: BookSearchPagination) => {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => bookService.searchPagination(params)
  });
};

export const useGetBookByID = (id: string) => {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => bookService.getByID(id)
  });
};
