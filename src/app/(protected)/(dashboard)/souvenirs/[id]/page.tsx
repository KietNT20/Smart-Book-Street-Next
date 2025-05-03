'use client';

import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { useGetSouvenirById } from '@/hooks/use-souvenir';
import dynamic from 'next/dynamic';

const SouvenirForm = dynamic(() => import('../_components/souvenir-form'), {
  ssr: false,
});

const Page = ({ params }: { params: { id: string } }) => {
  const { souvenir } = useGetSouvenirById(params.id);
  useEntityBreadcrumb(
    PATH.SOUVENIRS,
    'Đồ lưu niệm',
    params.id,
    souvenir?.souvenirName
  );
  return (
    <div className='container mx-auto p-4 md:px-32 md:py-4'>
      {souvenir && <SouvenirForm souvenirToEdit={souvenir} />}
    </div>
  );
};

export default Page;
