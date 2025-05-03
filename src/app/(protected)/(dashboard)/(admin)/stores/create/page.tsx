import { Separator } from '@/components/ui/separator';
import dynamic from 'next/dynamic';

const StoreForm = dynamic(() => import('../_components/store-form'), {
  ssr: false,
});

const CreateStorePage = () => {
  return (
    <div className='container mx-auto p-4 md:px-8 md:py-4'>
      <h2 className='text-2xl font-bold'>Tạo cửa hàng</h2>
      <Separator className='my-4' />
      <div>
        <StoreForm />
      </div>
    </div>
  );
};

export default CreateStorePage;
