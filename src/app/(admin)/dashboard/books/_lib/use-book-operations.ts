import { useBookSearch } from '@/hooks/use-book-search';
import { useBookMutations } from '@/hooks/use-books';
import { useToast } from '@/hooks/use-toast';
import { BookFormValues } from '@/lib/zod';
import { Book, BookSearchCriteria } from '@/types/book-types';

interface UseBookOperationsProps {
  pagination: BookTableState;
  searchCriteria: Partial<BookSearchCriteria>;
  onSuccess: () => void;
}

interface BookTableState {
  pageIndex: number;
  pageSize: number;
  sortField: string;
  sortOrder: number;
}

export interface UseBookOperationsResult {
  bookData:
    | {
        results: Book[];
        totalPages: number;
      }
    | undefined;
  isLoadingBooks: boolean;
  handleSubmit: (data: BookFormValues, selectedBook?: Book) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  createBookMutation: {
    isPending: boolean;
  };
  updateBookMutation: {
    isPending: boolean;
  };
  deleteBookMutation: {
    isPending: boolean;
  };
}

export function useBookOperations({
  pagination,
  searchCriteria,
  onSuccess,
}: UseBookOperationsProps) {
  const { toast } = useToast();

  const { data: bookData, isLoading: isLoadingBooks } = useBookSearch({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sortField: pagination.sortField,
    sortOrder: pagination.sortOrder,
    result: searchCriteria,
  });

  const { createBookMutation, updateBookMutation, deleteBookMutation } =
    useBookMutations();

  const handleSubmit = async (data: BookFormValues, selectedBook?: Book) => {
    try {
      if (selectedBook) {
        await updateBookMutation.mutateAsync(data);
        toast({
          title: 'Cập nhật thành công',
          description: 'Sách đã được cập nhật',
          variant: 'success',
        });
      } else {
        await createBookMutation.mutateAsync(data);
        toast({
          title: 'Thêm mới thành công',
          description: 'Sách đã được thêm vào hệ thống',
          variant: 'success',
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Không thể lưu thông tin sách. Vui lòng thử lại',
        variant: 'destructive',
      });
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBookMutation.mutateAsync(id);
      toast({
        title: 'Xóa thành công',
        description: 'Sách đã được xóa khỏi hệ thống',
      });
    } catch (error) {
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Không thể xóa sách. Vui lòng thử lại',
        variant: 'destructive',
      });
      console.error('Error deleting book:', error);
    }
  };

  return {
    bookData,
    isLoadingBooks,
    handleSubmit,
    handleDelete,
    createBookMutation,
    updateBookMutation,
    deleteBookMutation,
  };
}
