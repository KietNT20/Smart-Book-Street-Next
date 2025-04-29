'use client';

import { useGetBookByID } from '@/hooks/use-book-search';
import { useBookMutations } from '@/hooks/use-books';
import { useRouter } from 'next/navigation';

export const useBookDetail = ({ id }: { id: string }) => {
  const router = useRouter();
  const {
    data: bookDetailData,
    isLoading: bookDetailLoading,
    isPending: bookDetailPending,
  } = useGetBookByID(id);

  const { deleteBook, deleteBookPending } = useBookMutations();

  const deletedLoading = deleteBookPending;

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
