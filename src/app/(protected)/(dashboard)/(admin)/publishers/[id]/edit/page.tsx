'use client';

import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { usePublisherById } from '@/hooks/use-publisher';
import PublisherForm from '../../_components/publisher-form';

const EditPublisherPage = ({ params }: { params: { id: string } }) => {
  const { publisher } = usePublisherById(params.id);
  useEntityBreadcrumb(
    PATH.PUBLISHERS,
    'Nhà xuất bản',
    params.id,
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
