import { useBookSearchById } from '@/hooks/use-book-search';
import { useBookMutations } from '@/hooks/use-books';
import useDebounce from '@/hooks/useDebounce';
import { useParams, useRouter } from 'next/navigation';

export const useEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const { updateBookMutation } = useBookMutations();
  const { data: book } = useBookSearchById(bookId);
  const apiLoading = useDebounce(updateBookMutation.isPending, 300);

  const handleSubmit = (formData: FormData) => {
    console.log('formData edit page', formData);
    updateBookMutation.mutate(formData);
  };

  return {
    book,
    handleSubmit,
    router,
    apiLoading
  };
};
