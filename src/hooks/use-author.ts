import { PATH } from '@/enums/path';
import { authorService } from '@/services/authorService';
import { AuthorSearchPagination } from '@/types/author-types';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useGetAuthorById = <T>(id: string) => {
  return useQuery<T>({
    queryKey: ['author', id],
    queryFn: () => authorService.getById(id)
  });
};

export const useSearchPaginationAuthor = (params: AuthorSearchPagination) => {
  return useQuery({
    queryKey: ['authors', params],
    queryFn: () => authorService.searchPagination(params)
  });
};

export const useAuthorMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const searchAuthorName = useMutation({
    mutationKey: ['search-author-name'],
    mutationFn: (payload: { authorName: string; categoryId?: string }) =>
      authorService.search(payload)
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
    }
  });

  const updateAuthor = useMutation({
    mutationKey: ['update-author'],
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      authorService.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error: Error) => {
      console.error('Error Update Author:', error);
    }
  });

  const deleteAuthor = useMutation({
    mutationKey: ['delete-author'],
    mutationFn: (id: string) => authorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error: Error) => {
      console.error('Error Delete Author:', error);
    }
  });

  return {
    createAuthor,
    updateAuthor,
    deleteAuthor,
    searchAuthorName
  };
};
