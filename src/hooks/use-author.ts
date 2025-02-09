import { authorService } from '@/services/authorService';
import { Author, AuthorPayload } from '@/types/author-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetAllAuthors = () => {
  return useQuery({
    queryKey: ['authors'],
    queryFn: authorService.getAllActive,
  });
};

export const useAuthorMutation = () => {
  const queryClient = useQueryClient();
  const createAuthor = useMutation({
    mutationFn: (payload: AuthorPayload) => authorService.add(payload),
    onSuccess: (data) => {
      if (data) {
        toast.success('Thêm tác giả thành công');
      }
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error) => {
      console.error('Error Add Author:', error);
    },
  });
  const updateAuthor = useMutation({
    mutationFn: (payload: Omit<Author, 'images'>) =>
      authorService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error) => {
      console.error('Error Update Author:', error);
    },
  });
  const deleteAuthor = useMutation({
    mutationFn: (id: string) => authorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error) => {
      console.error('Error Delete Author:', error);
    },
  });
  return {
    createAuthor,
    updateAuthor,
    deleteAuthor,
  };
};
