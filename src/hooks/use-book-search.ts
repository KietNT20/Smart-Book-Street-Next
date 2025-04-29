import { bookService } from '@/services/bookService';
import { BookSearchPagination } from '@/types/book-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetBooks = ({
  sortField,
  sortOrder,
  result,
  pageSize,
  pageNumber,
}: BookSearchPagination) => {
  const queryClient = useQueryClient();
  const {
    data: booksRes,
    isLoading,
    isPending,
    error,
  } = useQuery({
    queryKey: ['books', sortField, sortOrder, result, pageSize, pageNumber],
    queryFn: () =>
      bookService.searchPagination({
        sortField,
        sortOrder,
        result,
        pageSize,
        pageNumber,
      }),
  });

  const totalPage = booksRes?.totalPages || 1;

  if (pageNumber < totalPage) {
    queryClient.prefetchQuery({
      queryKey: [
        'books',
        sortField,
        sortOrder,
        result,
        pageSize,
        pageNumber + 1,
      ],
      queryFn: () =>
        bookService.searchPagination({
          sortField,
          sortOrder,
          result,
          pageSize,
          pageNumber: pageNumber + 1,
        }),
    });
  }

  if (pageNumber > 1) {
    queryClient.prefetchQuery({
      queryKey: [
        'books',
        sortField,
        sortOrder,
        result,
        pageSize,
        pageNumber - 1,
      ],
      queryFn: () =>
        bookService.searchPagination({
          sortField,
          sortOrder,
          result,
          pageSize,
          pageNumber: pageNumber - 1,
        }),
    });
  }

  return {
    booksData: booksRes?.results || [],
    isLoading,
    isPending,
    error,
    totalPage,
  };
};

export const useGetBookByID = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['books', id],
    queryFn: () => bookService.getByID(id),
    enabled: !!id,
  });

  return {
    bookData: data?.result,
    isLoading,
  };
};
