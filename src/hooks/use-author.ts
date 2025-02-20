import { authorService } from '@/services/authorService';
import {
  Author,
  AuthorPayload,
  SearchPaginationAuthor,
} from '@/types/author-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetAuthorById = (id: string) => {
  return useQuery({
    queryKey: ['author', id],
    queryFn: () => authorService.getById(id),
  });
};

export const useSearchPaginationAuthor = (params: SearchPaginationAuthor) => {
  return useQuery({
    queryKey: ['authors', params],
    queryFn: () => authorService.searchPagination(params),
  });
};

export const useAuthorMutation = () => {
  const queryClient = useQueryClient();

  const searchAuthorName = useMutation({
    mutationKey: ['search-author-name'],
    mutationFn: (payload: { authorName: string }) =>
      authorService.search(payload),
  });

  const createAuthor = useMutation({
    mutationFn: (payload: AuthorPayload) => authorService.add(payload),
    onSuccess: (data) => {
      if (data) {
        toast.success('Thêm tác giả thành công');
      }
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error: Error) => {
      console.error('Error Add Author:', error);
    },
  });

  const updateAuthor = useMutation({
    mutationFn: (payload: Omit<Author, 'images'>) =>
      authorService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error: Error) => {
      console.error('Error Update Author:', error);
    },
  });

  const deleteAuthor = useMutation({
    mutationFn: (id: string) => authorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error: Error) => {
      console.error('Error Delete Author:', error);
    },
  });

  return {
    createAuthor,
    updateAuthor,
    deleteAuthor,
    searchAuthorName,
  };
};
