'use client';

import { useZoneDetail } from '@/hooks/use-zone';
import ZoneForm from '../_components/zone-form';

const Page = ({ params }: { params: { zoneId: string } }) => {
  const { zoneDetail } = useZoneDetail(params.zoneId);
  return (
    <div className='container mx-auto md:px-8 md:py-8'>
      {zoneDetail && <ZoneForm zoneToEdit={zoneDetail} />}
    </div>
  );
};

export default Page;
