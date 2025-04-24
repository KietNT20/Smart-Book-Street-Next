'use client';

import { Separator } from '@/components/ui/separator';
import { useStoreById } from '@/hooks/use-store';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import StoreForm from '../../../_components/store-form';
import Loading from '../loading';

const StoreFormEdit = () => {
  const params = useParams();
  const storeId = params.storeId as string;
  const { store } = useStoreById(storeId);
  return (
    <Suspense fallback={<Loading />}>
      <h2 className='text-2xl font-bold'>Chỉnh sửa cửa hàng</h2>
      <Separator className='my-4' />
      <div>{store && <StoreForm storeToEdit={store} />}</div>
    </Suspense>
  );
};

export default StoreFormEdit;
