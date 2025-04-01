import { useBookSearch } from '@/hooks/use-book-search';
import { useBookMutations } from '@/hooks/use-books';
import useDebounce from '@/hooks/use-debounce';
import { BookSearchCriteria } from '@/types/book-types';
import { toast } from 'sonner';

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
  const { data: bookData, isLoading } = useBookSearch({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sortField: pagination.sortField,
    sortOrder: pagination.sortOrder,
    result: searchCriteria
  });

  const isLoadingBooks = useDebounce(isLoading, 300);

  const { deleteBook, deleteBookPending } = useBookMutations();
  const deletedLoading = useDebounce(deleteBookPending, 300);

  const handleDelete = (id: string) => {
    try {
      deleteBook(id);
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi xóa sách');
      console.error('Error deleting book:', error);
    }
  };

  return {
    bookData,
    isLoadingBooks,
    handleDelete,
    deletedLoading
  };
}
