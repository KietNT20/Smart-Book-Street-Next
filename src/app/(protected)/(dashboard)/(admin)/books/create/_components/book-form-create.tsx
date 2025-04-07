'use client';

import { PATH } from '@/enums/path';
import { useRouter } from 'next/navigation';
import BookForm from '../../_components/book-form';

const BookFormCreate = () => {
  const router = useRouter();

  return (
    <div className='relative'>
      <BookForm onCancel={() => router.push(PATH.ADMIN_BOOKS)} />
    </div>
  );
};

export default BookFormCreate;
