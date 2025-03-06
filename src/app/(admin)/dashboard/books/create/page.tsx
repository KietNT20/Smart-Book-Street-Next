'use client';

import BackButton from '@/components/back-btn/back-button';
import { Separator } from '@/components/ui/separator';
import { PATH } from '@/enums/path';
import useDebounce from '@/hooks/useDebounce';
import { BookFormValues } from '@/lib/zod';
import { useRouter } from 'next/navigation';
import BookForm from '../_components/book-form';
import { useCreateBook } from '../_lib/use-book-operations';

export default function CreateBookPage() {
  const router = useRouter();
  const { handleCreate, isLoading } = useCreateBook({
    _onSuccess: () => router.push(PATH.BOOKS)
  });
  const apiLoading = useDebounce(isLoading, 300);

  const handleSubmit = (data: BookFormValues) => {
    handleCreate(data);
  };

  return (
    <div className='container relative mx-auto'>
      <div className='space-y-2'>
        <BackButton routeTo={PATH.BOOKS} />
        <div className='rounded-lg border-2 md:px-20 md:pb-7 md:pt-10'>
          <h3 className='text-2xl font-bold'>Thêm sách mới</h3>
          <Separator className='my-4' />
          <div className='relative'>
            <BookForm
              onSubmit={handleSubmit}
              onCancel={() => router.back()}
              isLoading={apiLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
