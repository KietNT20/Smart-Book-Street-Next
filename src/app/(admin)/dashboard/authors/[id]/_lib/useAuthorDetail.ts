import { useGetAuthorById } from '@/hooks/use-author';
import useDebounce from '@/hooks/useDebounce';
import { AuthorApiResponse } from '@/types/author-types';
import { useRouter } from 'next/navigation';

export const useAuthorDetail = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data: authorData, isLoading: authorLoading } =
    useGetAuthorById<AuthorApiResponse>(id);
  const author = authorData?.result;

  const authorPending = useDebounce(authorLoading, 300);
  return { router, author, authorPending };
};
