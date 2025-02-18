'use client';

import BackButton from '@/components/back-btn/back-button';
import { Separator } from '@/components/ui/separator';
import { PATH } from '@/enums/path';
import { useBookSearchById } from '@/hooks/use-book-search';
import useDebounce from '@/hooks/useDebounce';
import { BookFormValues } from '@/lib/zod';
import { useParams, useRouter } from 'next/navigation';
import { useUpdateBook } from '../../_lib/use-book-operations';
import BookForm from '../../_components/book-form';

export default function EditBookPage() {
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

  return (
    <div className='container relative mx-auto'>
      <div className='space-y-2'>
        <div className=''>
          <BackButton />
        </div>
        <div className='rounded-lg border-2 px-20 py-4'>
          <h3 className='text-2xl font-bold'>Cập nhật sách</h3>
          <Separator className='my-4' />
          <div className=''>
            {book && (
              <BookForm
                book={book?.result}
                onSubmit={handleSubmit}
                onCancel={() => router.push(PATH.BOOKS)}
                isLoading={apiLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
