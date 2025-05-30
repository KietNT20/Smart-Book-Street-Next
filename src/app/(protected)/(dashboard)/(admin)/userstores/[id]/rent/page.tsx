'use client';

import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserStoreForm from './_components/user-store-form';

const UserStoreRentPage = () => {
  const params = useParams();
  const [storeId, setStoreId] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (params.id && typeof params.id === 'string') {
      setStoreId(params.id);
    }
  }, [params.id]);

  useEntityBreadcrumb(
    PATH.USER_STORES,
    'Cửa hàng của người dùng',
    storeId,
    'Cửa hàng'
  );

  if (!isMounted) {
    return (
      <div className='container mx-auto p-4 md:px-24'>
        <h3 className='font-bold'>Đơn đăng ký</h3>
        <div className='mt-4 rounded-lg border bg-background p-16 shadow-md'>
          <div className='flex items-center justify-center p-8'>
            <div className='h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent' />
          </div>
        </div>
      </div>
    );
  }

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
