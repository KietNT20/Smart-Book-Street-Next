import BackButton from '@/components/back-btn/back-button';
import { Separator } from '@/components/ui/separator';
import BookFormEdit from './_components/book-form-edit';

export default function EditBookPage() {
  return (
    <div className='container relative mx-auto'>
      <div className='space-y-2'>
        <div className=''>
          <BackButton />
        </div>
        <div className='rounded-lg border-2 px-20 py-4'>
          <h3 className='text-2xl font-bold'>Cập nhật sách</h3>
          <Separator className='my-4' />
          {/* Book Form Edit */}
          <BookFormEdit />
        </div>
      </div>
    </div>
  );
}
