import { useGetBookByID } from '@/hooks/use-book-search';
import { useBookMutations } from '@/hooks/use-books';
import useDebounce from '@/hooks/use-debounce';
import { useParams, useRouter } from 'next/navigation';

export const useEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const { updateBookMutation } = useBookMutations();
  const { data: book } = useGetBookByID(bookId);
  const apiLoading = useDebounce(updateBookMutation.isPending, 300);

  const handleSubmitUpdate = async (formData: FormData) => {
    await updateBookMutation.mutateAsync({ id: bookId, formData });
  };

  return {
    book,
    handleSubmitUpdate,
    router,
    apiLoading
  };
};
