// hooks/use-book-operations.ts
import { useBookSearch } from '@/hooks/use-book-search';
import { useBookMutations } from '@/hooks/use-books';
import { useToast } from '@/hooks/use-toast';
import useDebounce from '@/hooks/useDebounce';
import { BookFormValues } from '@/lib/zod';
import { BookSearchCriteria } from '@/types/book-types';

type UseBookListProps = {
  pagination: BookTableState;
  searchCriteria: Partial<BookSearchCriteria>;
};

type UseBookMutationProps = {
  onSuccess?: () => void;
};

type BookTableState = {
  pageIndex: number;
  pageSize: number;
  sortField: string;
  sortOrder: number;
};

export function useBookList({ pagination, searchCriteria }: UseBookListProps) {
  const { toast } = useToast();
  const { data: bookData, isLoading } = useBookSearch({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sortField: pagination.sortField,
    sortOrder: pagination.sortOrder,
    result: searchCriteria,
  });

  const isLoadingBooks = useDebounce(isLoading, 300);

  const { deleteBookMutation } = useBookMutations();

  const handleDelete = async (id: string) => {
    try {
      await deleteBookMutation.mutateAsync(id);
      toast({
        title: 'Xóa thành công',
        description: 'Sách đã được xóa khỏi hệ thống',
        variant: 'success',
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
    handleDelete,
    deleteBookMutation,
  };
}

// Hook for create and update book
export function useCreateBook({ onSuccess }: UseBookMutationProps = {}) {
  const { toast } = useToast();
  const { createBookMutation } = useBookMutations();

  const handleCreate = async (data: BookFormValues) => {
    try {
      await createBookMutation.mutateAsync(data);
      toast({
        title: 'Thêm mới thành công',
        description: 'Sách đã được thêm vào hệ thống',
        variant: 'success',
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Không thể lưu thông tin sách. Vui lòng thử lại',
        variant: 'destructive',
      });
      console.error('Error:', error);
    }
  };

  return {
    handleCreate,
    isLoading: createBookMutation.isPending,
  };
}

export function useUpdateBook({ onSuccess }: UseBookMutationProps = {}) {
  const { toast } = useToast();
  const { updateBookMutation } = useBookMutations();

  const handleUpdate = async (data: BookFormValues) => {
    try {
      await updateBookMutation.mutateAsync(data);
      toast({
        title: 'Cập nhật thành công',
        description: 'Sách đã được cập nhật',
        variant: 'success',
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Không thể lưu thông tin sách. Vui lòng thử lại',
        variant: 'destructive',
      });
      console.error('Error:', error);
    }
  };

  return {
    handleUpdate,
    isLoading: updateBookMutation.isPending,
  };
}
