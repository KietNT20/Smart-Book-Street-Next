import { useGetBookByID } from '@/hooks/use-book-search';
import { useBookMutations } from '@/hooks/use-books';
import useDebounce from '@/hooks/use-debounce';
import { useParams, useRouter } from 'next/navigation';

export const useEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const { updateBook, updateBookPending } = useBookMutations();
  const { data: book } = useGetBookByID(bookId);
  const apiLoading = useDebounce(updateBookPending, 300);

  const handleSubmitUpdate = (formData: FormData) => {
    updateBook({ id: bookId, formData });
  };

  return {
    book,
    handleSubmitUpdate,
    router,
    apiLoading
  };
};
