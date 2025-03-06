import { Image as ImageIcon } from 'lucide-react';

type Props = {
  bookCode?: string;
};

const EmptyState = ({ bookCode }: Props) => {
  return (
    <div className='flex h-60 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center'>
      <ImageIcon className='mb-4 h-12 w-12 text-gray-400' />
      <h3 className='mb-2 text-sm font-medium'>Chưa có hình ảnh</h3>
      <p className='text-xs text-gray-500'>
        Tải lên hình ảnh cho sách &quot;{bookCode || ''}&quot; bằng cách nhấn
        nút &quot;Tải ảnh lên&quot;
      </p>
    </div>
  );
};

export default EmptyState;
