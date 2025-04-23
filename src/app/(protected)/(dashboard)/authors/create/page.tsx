'use client';

import { Separator } from '@/components/ui/separator';
import { Suspense } from 'react';
import { AuthorForm } from '../_components/author-form';
import Loading from './loading';

const CreatePage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <div className='container relative mx-auto overflow-hidden'>
        <div className='rounded-lg border-2 md:px-20 md:pb-7 md:pt-10'>
          <h3 className='text-2xl font-bold'>Thêm tác giả mới</h3>
          <Separator className='my-4' />
          <AuthorForm />
        </div>
      </div>
    </Suspense>
  );
};

export default CreatePage;
