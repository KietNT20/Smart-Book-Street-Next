import { useGetAuthorById } from '@/hooks/use-author';
import { useRouter } from 'next/navigation';

export const useAuthorDetail = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data: authorData, isLoading: authorLoading } = useGetAuthorById(id);
  const author = authorData?.result;

  const authorPending = authorLoading;
  return { router, author, authorPending };
};
