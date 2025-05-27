'use client';

import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { useGetStreetById } from '@/hooks/use-street';
import StreetForm from '../../_components/street-form';

export default function EditStreetPage({ params }: { params: { id: string } }) {
  const { streetRes } = useGetStreetById(params.id);
  useEntityBreadcrumb(
    PATH.STREETS,
    'Đường sách',
    params.id,
    streetRes?.streetName,
    true
  );
  return (
    <div className='container mx-auto p-4 md:px-32 md:py-4'>
      <StreetForm mode='update' initialData={streetRes} />
    </div>
  );
}
