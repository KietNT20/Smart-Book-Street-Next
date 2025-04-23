'use client';

import { usePublisherById } from '@/hooks/use-publisher';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import PublisherForm from '../../_components/publisher-form';
import Loading from './loading';

const EditPublisherPage = () => {
  const params = useParams();
  const publisherId = params.id as string;
  const { publisher } = usePublisherById(publisherId);
  return (
    <Suspense fallback={<Loading />}>
      <div className='container mx-auto md:px-32 md:py-4'>
        {publisher && <PublisherForm publisher={publisher} />}
      </div>
    </Suspense>
  );
};

export default EditPublisherPage;
