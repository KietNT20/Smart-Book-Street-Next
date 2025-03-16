'use client';

import BackButton from '@/components/back-btn/back-button';
import { Separator } from '@/components/ui/separator';
import { PATH } from '@/enums/path';
import { useRouter } from 'next/navigation';
import BookForm from '../_components/book-form';
import { useBookMutations } from '@/hooks/use-books';
import useDebounce from '@/hooks/useDebounce';

export default function CreateBookPage() {
  const router = useRouter();
  const { createBookMutation } = useBookMutations();
  const apiLoading = useDebounce(createBookMutation.isPending, 300);

  const handleSubmit = (formData: FormData) => {
    createBookMutation.mutate(formData);
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
