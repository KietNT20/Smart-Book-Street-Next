import { Separator } from '@/components/ui/separator';
import { AuthorForm } from '../_components/author-form';

const CreatePage = () => {
  return (
    <div className='container relative mx-auto overflow-hidden'>
      <div className='rounded-lg border-2 md:px-20 md:pb-7 md:pt-10'>
        <h3 className='text-2xl font-bold'>Thêm tác giả mới</h3>
        <Separator className='my-4' />
        <AuthorForm />
      </div>
    </div>
  );
};

export default CreatePage;
