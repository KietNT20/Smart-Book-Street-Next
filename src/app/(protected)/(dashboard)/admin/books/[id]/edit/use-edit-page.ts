import { useGetBookByID } from '@/hooks/use-book-search';
import { useParams, useRouter } from 'next/navigation';

export const useEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const { data: book } = useGetBookByID(bookId);

  return {
    book,
    router
  };
};
