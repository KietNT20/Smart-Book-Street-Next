'use client';

import { usePublisherById } from '@/hooks/use-publisher';
import { useParams } from 'next/navigation';
import PublisherForm from '../../_components/publisher-form';

const EditPublisherPage = () => {
  const params = useParams();
  const publisherId = params.id as string;
  const { publisher } = usePublisherById(publisherId);
  return (
    <div className='container mx-auto md:px-32 md:py-4'>
      {publisher && <PublisherForm publisher={publisher} />}
    </div>
  );
};

export default EditPublisherPage;
