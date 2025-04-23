'use client';

import { useGetSouvenirById } from '@/hooks/use-souvenir';
import { Suspense } from 'react';
import SouvenirForm from '../_components/souvenir-form';
import Loading from './loading';

const Page = ({ params }: { params: { id: string } }) => {
  const { souvenir } = useGetSouvenirById(params.id);
  return (
    <Suspense fallback={<Loading />}>
      <div className='container mx-auto md:px-32 md:py-4'>
        {souvenir && <SouvenirForm souvenirToEdit={souvenir} />}
      </div>
    </Suspense>
  );
};

export default Page;
