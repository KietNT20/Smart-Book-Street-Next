'use client';

import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

const UserStoreForm = dynamic(() => import('./_components/user-store-form'), {
  ssr: false,
});

const UserStoreRentPage = () => {
  const params = useParams();
  const storeId = params.id as string;

  useEntityBreadcrumb(
    PATH.USER_STORES,
    'Cửa hàng của người dùng',
    storeId,
    'Cửa hàng'
  );

  return (
    <div className='container mx-auto p-4 md:px-24'>
      <h3 className='font-bold'>Đơn đăng ký</h3>
      <div className='mt-4 rounded-lg border bg-background p-16 shadow-md'>
        <UserStoreForm storeIdParam={storeId} />
      </div>
    </div>
  );
};

export default UserStoreRentPage;
