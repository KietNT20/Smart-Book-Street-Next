import { Separator } from '@/components/ui/separator';
import BookFormEdit from './_components/book-form-edit';

export default function EditBookPage() {
  return (
    <div className='container relative mx-auto overflow-hidden'>
      <div className='rounded-lg border-2 md:px-20 md:pb-7 md:pt-10'>
        <h3 className='text-2xl font-bold'>Cập nhật sách</h3>
        <Separator className='my-4' />
        <BookFormEdit />
      </div>
    </div>
  );
}
