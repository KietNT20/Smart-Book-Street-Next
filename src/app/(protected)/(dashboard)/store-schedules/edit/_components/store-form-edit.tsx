'use client';

import { Separator } from '@/components/ui/separator';
import { STORAGE } from '@/constant/storage';
import { useStoreById } from '@/hooks/use-store';
import { getLocalStorageItem } from '@/utils/token';
import StoreForm from './store-form';

const StoreFormEdit = () => {
  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);
  const { store } = useStoreById(storeId);
  return (
    <div className='md:px-32 md:py-10'>
      <h2 className='text-2xl font-bold'>Chỉnh sửa thông tin cửa hàng</h2>
      <Separator className='my-4' />
      <div>{storeId && store && <StoreForm storeToEdit={store} />}</div>
    </div>
  );
};

export default StoreFormEdit;
