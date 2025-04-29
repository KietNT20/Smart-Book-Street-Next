import { useGetBooks } from '@/hooks/use-book-search';
import { BookSearchCriteria } from '@/types/book-types';

type UseBookListProps = {
  pagination: BookTableState;
  searchCriteria: Partial<BookSearchCriteria>;
};

type BookTableState = {
  pageIndex: number;
  pageSize: number;
  sortField: string;
  sortOrder: number;
};

export function useBookList({ pagination, searchCriteria }: UseBookListProps) {
  const {
    booksRes,
    isLoading: isLoadingBooks,
    isPending,
  } = useGetBooks({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sortField: pagination.sortField,
    sortOrder: pagination.sortOrder,
    result: searchCriteria,
  });

  return {
    booksRes,
    isLoadingBooks,
    isPending,
  };
}
