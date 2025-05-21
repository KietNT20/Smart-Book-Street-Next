import { StoreData } from '@/types/store-types';
import dayjs from 'dayjs';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

type Props = {
  store: (StoreData & { id: string }) | null;
};

const StoreInfo = ({ store }: Props) => {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='mb-4 text-xl font-semibold'>Thông tin liên hệ</h2>
        <div className='space-y-3'>
          <div className='flex items-start'>
            <MapPin className='mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-500' />
            <div>
              <h5 className='font-medium text-primary'>Địa chỉ</h5>
              <p>{store?.address || 'Không có địa chỉ'}</p>
            </div>
          </div>
          {store?.phone && (
            <div className='flex items-start'>
              <Phone className='mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-500' />
              <div>
                <h5 className='font-medium text-muted-foreground'>
                  Số điện thoại
                </h5>
                <p>{store?.phone || 'Không có số điện thoại'}</p>
              </div>
            </div>
          )}
          {store?.email && (
            <div className='flex items-start'>
              <Mail className='mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-500' />
              <div>
                <h5 className='font-medium text-muted-foreground'>Email</h5>
                <p>{store?.email || 'Không có email'}</p>
              </div>
            </div>
          )}
          {(store?.openingTime || store?.closingTime) && (
            <div className='flex items-start'>
              <Clock className='mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-500' />
              <div>
                <h4 className='font-medium'>Giờ mở cửa</h4>
                <p className='text-zinc-600'>
                  {store?.openingTime && store?.closingTime
                    ? `${dayjs(store?.openingTime).format('HH:mm')} - ${dayjs(store?.closingTime).format('HH:mm')}`
                    : 'Chưa cung cấp'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {store?.zone && (
        <div>
          <h2 className='mb-4 text-xl font-bold'>Khu vực</h2>
          <div className='rounded-lg border p-4'>
            <h3 className='mb-2 text-lg font-semibold'>
              {store?.zone?.zoneName || 'Tên khu vực'}
            </h3>
            <p>{store?.zone?.description || 'Không có mô tả'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreInfo;
