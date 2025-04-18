import { Separator } from '@/components/ui/separator';
import StoreForm from '../_components/store-form';

const CreateStorePage = () => {
  return (
    <div className='container mx-auto md:px-8 md:py-8'>
      <h2 className='text-2xl font-bold'>Tạo cửa hàng</h2>
      <Separator className='my-4' />
      <div>
        <StoreForm />
      </div>
    </div>
  );
};

export default CreateStorePage;
