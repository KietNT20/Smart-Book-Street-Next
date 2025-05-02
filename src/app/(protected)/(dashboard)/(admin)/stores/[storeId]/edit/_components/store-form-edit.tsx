'use client';

import { Separator } from '@/components/ui/separator';
import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { useStoreById } from '@/hooks/use-store';
import { useParams } from 'next/navigation';
import StoreForm from '../../../_components/store-form';

const StoreFormEdit = () => {
  const params = useParams();
  const storeId = params.storeId as string;
  const { store } = useStoreById(storeId);
  useEntityBreadcrumb(PATH.STORES, 'Cửa hàng', storeId, store?.storeName, true);
  return (
    <>
      <h2 className='text-2xl font-bold'>Chỉnh sửa cửa hàng</h2>
      <Separator className='my-4' />
      <div>{store && <StoreForm storeToEdit={store} />}</div>
    </>
  );
};

export default StoreFormEdit;
