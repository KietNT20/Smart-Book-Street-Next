'use client';

import { useRouter } from 'next/navigation';
import BookForm from '../../_components/book-form';

const BookFormCreate = () => {
  const router = useRouter();

  return (
    <div className='relative'>
      <BookForm onCancel={() => router.back()} />
    </div>
  );
};

export default BookFormCreate;
