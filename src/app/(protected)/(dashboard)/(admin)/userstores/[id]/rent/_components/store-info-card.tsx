import { Card, CardContent } from '@/components/ui/card';
import { StoreData } from '@/types/store-types';
import { Store as StoreIcon } from 'lucide-react';

type Props = {
  store: StoreData | null;
  isLoading: boolean;
};

const StoreInfoCard = ({ store, isLoading }: Props) => {
  return (
    <Card className='w-full'>
      <CardContent className='p-4'>
        <div className='mb-2 flex items-center'>
          <StoreIcon className='mr-2 text-primary' size={18} />
          <span className='font-medium'>Thông tin cửa hàng</span>
        </div>

        {isLoading ? (
          <p className='text-sm text-muted-foreground'>Đang tải thông tin...</p>
        ) : store ? (
          <div className='space-y-2 text-sm'>
            <div className='flex items-center gap-3'>
              <span className='text-muted-foreground'>Tên cửa hàng:</span>
              <span className='font-medium'>{store?.storeName || 'N/A'}</span>
            </div>
            <div className='flex items-center gap-3'>
              <span className='text-muted-foreground'>Địa chỉ:</span>
              <span className='font-medium'>{store?.address || 'N/A'}</span>
            </div>
          </div>
        ) : (
          <p className='text-sm text-muted-foreground'>
            Không tìm thấy thông tin cửa hàng
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StoreInfoCard;
