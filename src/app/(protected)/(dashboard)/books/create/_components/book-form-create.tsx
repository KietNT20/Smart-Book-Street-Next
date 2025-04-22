'use client';

import { PATH } from '@/enums/path';
import { Book } from '@/types/book-types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BookForm from '../../_components/book-form';
import ISBNScanner from '../../_components/isbn-scanner';

const BookCreationPage = () => {
  const router = useRouter();
  const [scannedBook, setScannedBook] = useState<Book | null>(null);

  const enhancedScanner = () => {
    return (
      <ISBNScanner
        onBookFound={(bookData: Book) => {
          setScannedBook(bookData);
        }}
      />
    );
  };

  return (
    <div className='space-y-6'>
      {!scannedBook && (
        <div className='mb-6'>
          <h2 className='mb-2 text-lg font-medium'>Quét mã ISBN</h2>
          {enhancedScanner()}
        </div>
      )}

      <BookForm
        book={scannedBook || undefined}
        mode='create'
        onCancel={() => {
          setScannedBook(null);
          router.push(PATH.BOOKS);
        }}
      />
    </div>
  );
};

export default BookCreationPage;
