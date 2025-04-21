'use client';

import { useGetSouvenirById } from '@/hooks/use-souvenir';
import SouvenirForm from '../_components/souvenir-form';

const Page = ({ params }: { params: { id: string } }) => {
  const { souvenir } = useGetSouvenirById(params.id);
  return (
    <div className='container mx-auto md:px-32 md:py-4'>
      {souvenir && <SouvenirForm souvenirToEdit={souvenir} />}
    </div>
  );
};

export default Page;
