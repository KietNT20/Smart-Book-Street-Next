import { Separator } from '@/components/ui/separator';
import { AuthorForm } from '../_components/author-form';

const CreatePage = () => {
  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-3xl font-semibold'>Tạo tác giả</h3>
      </div>
      <Separator />
      <div className='py-8'>
        <AuthorForm />
      </div>
    </>
  );
};

export default CreatePage;
