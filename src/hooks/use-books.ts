'use client';
import {
  getAllBooks,
  getAllBooksPagination,
  getBookById,
} from '@/services/bookService';
import { PaginationSchema } from '@/types/common-types';
import { useQuery } from '@tanstack/react-query';

export function useGetAllBooks() {
  return useQuery({
    queryKey: ['books'],
    queryFn: getAllBooks,
  });
}

export function useGetBookById(id: string) {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => getBookById(id),
  });
}

export function useGetBooksPagination({
  pageNumber,
  pageSize,
  sortField,
  sortOrder,
}: PaginationSchema) {
  return useQuery({
    queryKey: [
      'books-pagination',
      { pageNumber, pageSize, sortField, sortOrder },
    ],
    queryFn: () =>
      getAllBooksPagination({ pageNumber, pageSize, sortField, sortOrder }),
  });
}

export function useBookSearch() {}
