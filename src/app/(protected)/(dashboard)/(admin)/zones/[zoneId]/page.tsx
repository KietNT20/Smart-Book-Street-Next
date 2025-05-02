'use client';

import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { useZoneDetail } from '@/hooks/use-zone';
import ZoneForm from '../_components/zone-form';

const Page = ({ params }: { params: { zoneId: string } }) => {
  const { zoneDetail } = useZoneDetail(params.zoneId);
  useEntityBreadcrumb(
    PATH.ZONES,
    'Khu vực',
    params.zoneId,
    zoneDetail?.zoneName,
    true
  );
  return (
    <div className='container mx-auto md:px-8 md:py-8'>
      {zoneDetail && <ZoneForm zoneToEdit={zoneDetail} />}
    </div>
  );
};

export default Page;
