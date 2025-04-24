'use client';

import { useGetBookByID } from '@/hooks/use-book-search';
import { useBookMutations } from '@/hooks/use-books';
import useDebounce from '@/hooks/use-debounce';
import { useRouter } from 'next/navigation';

export const useBookDetail = ({ id }: { id: string }) => {
  const router = useRouter();
  const {
    data: bookDetailData,
    isLoading: bookDetailLoading,
    isPending: bookDetailPending,
  } = useGetBookByID(id);

  const { deleteBook, deleteBookPending } = useBookMutations();

  const deletedLoading = useDebounce(deleteBookPending, 300);

  const book = bookDetailData?.result;

  return {
    bookDetailPending,
    bookDetailLoading,
    deleteBook,
    deletedLoading,
    book,
    router,
  };
};
