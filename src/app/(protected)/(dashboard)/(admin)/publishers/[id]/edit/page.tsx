'use client';

import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { usePublisherById } from '@/hooks/use-publisher';
import { useParams } from 'next/navigation';
import PublisherForm from '../../_components/publisher-form';

const EditPublisherPage = () => {
  const params = useParams();
  const publisherId = params.id as string;
  const { publisher } = usePublisherById(publisherId);
  useEntityBreadcrumb(
    PATH.PUBLISHERS,
    'Nhà xuất bản',
    publisherId,
    publisher?.publisherName,
    true
  );
  return (
    <div className='container mx-auto p-4 md:px-32 md:py-4'>
      {publisher && <PublisherForm publisher={publisher} />}
    </div>
  );
};

export default EditPublisherPage;
