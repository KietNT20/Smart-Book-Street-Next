import { useBookSearchById } from '@/hooks/use-book-search';
import { useParams, useRouter } from 'next/navigation';

// TODO: Handle useEditPage logic
export const useEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const { data: book } = useBookSearchById(bookId);

  const handleSubmit = () => {};
  return {
    book,
    handleSubmit,
    router
  };
};
