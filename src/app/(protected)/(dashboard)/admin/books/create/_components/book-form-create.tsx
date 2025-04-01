'use client';

import { useBookMutations } from '@/hooks/use-books';
import useDebounce from '@/hooks/use-debounce';
import { useRouter } from 'next/navigation';
import BookForm from '../../_components/book-form';

const BookFormCreate = () => {
  const router = useRouter();
  const { createBook, createBookPending } = useBookMutations();
  const apiLoading = useDebounce(createBookPending, 300);

  const handleSubmit = (formData: FormData) => {
    createBook(formData);
  };

  return (
    <div className='relative'>
      <BookForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isLoading={apiLoading}
      />
    </div>
  );
};

export default BookFormCreate;
