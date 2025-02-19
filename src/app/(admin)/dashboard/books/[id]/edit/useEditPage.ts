import { PATH } from '@/enums/path';
import { useBookSearchById } from '@/hooks/use-book-search';
import useDebounce from '@/hooks/useDebounce';
import { BookFormValues } from '@/lib/zod';
import { useParams, useRouter } from 'next/navigation';
import { useUpdateBook } from '../../_lib/use-book-operations';

export const useEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const { data: book } = useBookSearchById(bookId);
  const { handleUpdate, isLoading } = useUpdateBook({
    _onSuccess: () => router.push(`${PATH.BOOKS}/${bookId}`),
  });
  const apiLoading = useDebounce(isLoading, 300);

  const handleSubmit = (data: BookFormValues) => {
    handleUpdate({ ...data, id: bookId });
  };
  return {
    book,
    handleSubmit,
    router,
    apiLoading,
  };
};
