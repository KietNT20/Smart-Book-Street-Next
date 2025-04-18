import { PATH } from '@/enums/path';
import { authorService } from '@/services/authorService';
import { AuthorSearchPagination } from '@/types/author-types';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useGetAuthorById = <T>(id: string) => {
  return useQuery<T>({
    queryKey: ['authors', id],
    queryFn: () => authorService.getById(id),
    enabled: !!id,
  });
};

export const useGetAuthors = ({
  sortField,
  sortOrder,
  result,
  pageNumber,
  pageSize,
}: AuthorSearchPagination) => {
  const queryClient = useQueryClient();
  const {
    data,
    isLoading: authorsLoading,
    error,
  } = useQuery({
    queryKey: ['authors', result, sortField, sortOrder, pageSize, pageNumber],
    queryFn: () =>
      authorService.searchPagination({
        pageNumber,
        pageSize,
        sortField,
        sortOrder,
        result,
      }),
  });
  // Prefetching
  const totalPage = data?.totalPages || 1;

  if (pageNumber < totalPage) {
    queryClient.prefetchQuery({
      queryKey: [
        'authors',
        result,
        sortField,
        sortOrder,
        pageSize,
        pageNumber + 1,
      ],
      queryFn: () =>
        authorService.searchPagination({
          result,
          sortField,
          sortOrder,
          pageSize,
          pageNumber: pageNumber + 1,
        }),
    });
  }

  if (pageNumber > 1) {
    queryClient.prefetchQuery({
      queryKey: [
        'authors',
        result,
        sortField,
        sortOrder,
        pageSize,
        pageNumber - 1,
      ],
      queryFn: () =>
        authorService.searchPagination({
          result,
          sortField,
          sortOrder,
          pageSize,
          pageNumber: pageNumber - 1,
        }),
    });
  }
  return {
    authorsRes: data?.results || [],
    authorsLoading,
    error,
    totalPage,
  };
};

export const useAuthorMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const searchAuthorName = useMutation({
    mutationKey: ['search-author-name'],
    mutationFn: (payload: { authorName: string; categoryId?: string }) =>
      authorService.search(payload),
  });

  const createAuthor = useMutation({
    mutationKey: ['create-author'],
    mutationFn: (formData: FormData) => authorService.create(formData),
    onSuccess: (data) => {
      if (data) {
        toast.success('Thêm tác giả thành công');
        router.push(PATH.ADMIN_AUTHORS);
      }
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error: Error) => {
      console.error('Error Add Author:', error);
    },
  });

  const updateAuthor = useMutation({
    mutationKey: ['update-author'],
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      authorService.update(id, formData),
    onSuccess: (data) => {
      if (data) {
        toast.success('Cập nhật tác giả thành công');
        router.push(`${PATH.ADMIN_AUTHORS}/${data.result.id}`);
      }
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error: Error) => {
      console.error('Error Update Author:', error);
    },
  });

  const deleteAuthor = useMutation({
    mutationKey: ['delete-author'],
    mutationFn: (id: string) => authorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error: Error) => {
      console.error('Error Delete Author:', error);
    },
  });

  return {
    // Create Author
    createAuthor: createAuthor.mutate,
    createAuthorPending: createAuthor.isPending,
    // Update Author
    updateAuthor: updateAuthor.mutate,
    updateAuthorPending: updateAuthor.isPending,
    // Delete Author
    deleteAuthor: deleteAuthor.mutate,
    deleteAuthorPending: deleteAuthor.isPending,
    // Search Author
    searchAuthorName,
  };
};
