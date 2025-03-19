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

  const handleSubmitUpdate = async (formData: FormData) => {
    console.log('handleSubmitUpdate được gọi với formData');
    console.log('formData có Id:', formData.get('Id')); // Debug
    console.log('bookId trước khi gọi mutation:', bookId); // Debug
    await updateBookMutation.mutateAsync({ id: bookId, formData });
  };

  return {
    book,
    handleSubmitUpdate,
    router,
    apiLoading
  };
};
