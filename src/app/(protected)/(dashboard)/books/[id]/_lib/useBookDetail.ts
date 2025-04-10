import { useGetBookByID } from '@/hooks/use-book-search';
import { useBookMutations } from '@/hooks/use-books';
import useDebounce from '@/hooks/use-debounce';
import { authorService } from '@/services/authorService';
import { categoryService } from '@/services/categoryService';
import { Book } from '@/types/book-types';
import { useQueries } from '@tanstack/react-query';
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

  const book: Book = bookDetailData?.result;

  const bookAuthorsRes = useQueries({
    queries: (book?.bookAuthors || [])?.map((bookAuth, index: number) => ({
      queryKey: ['author', index],
      queryFn: () => authorService.getById(bookAuth.authorId),
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  const bookCategoriesRes = useQueries({
    queries: (book?.bookCategories || [])?.map(
      (bookCategory, index: number) => ({
        queryKey: ['category', index],
        queryFn: () => categoryService.getById(bookCategory.categoryId),
      })
    ),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      };
    },
  });
  // Book Info Props
  const bookInfoProps = {
    book,
    bookAuthorsRes,
    bookCategoriesRes,
  };

  return {
    bookDetailPending,
    bookDetailLoading,
    deleteBook,
    deletedLoading,
    book,
    bookInfoProps,
    router,
  };
};
