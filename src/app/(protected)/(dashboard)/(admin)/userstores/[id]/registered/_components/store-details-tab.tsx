'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PATH } from '@/enums/path';
import { StoreData } from '@/types/store-types';
import { Mail, MapPin, Phone, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';

type StoreDetailsTabProps = {
  store: StoreData | null | undefined;
};

const StoreDetailsTab = ({ store }: StoreDetailsTabProps) => {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông Tin Cửa Hàng</CardTitle>
        <CardDescription>
          Thông tin về cửa hàng trong hợp đồng này
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Store className='h-5 w-5 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Tên Cửa Hàng
                </p>
                <p className='font-medium'>{store?.storeName}</p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <MapPin className='h-5 w-5 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Địa Chỉ
                </p>
                <p className='font-medium'>{store?.address}</p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Phone className='h-5 w-5 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Số Điện Thoại
                </p>
                <p className='font-medium'>{store?.phone || 'Chưa cung cấp'}</p>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Mail className='h-5 w-5 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Email
                </p>
                <p className='font-medium'>{store?.email || 'Chưa cung cấp'}</p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Store className='h-5 w-5 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Loại Cửa Hàng
                </p>
                <p className='font-medium'>{store?.type || 'Chưa cung cấp'}</p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <MapPin className='h-5 w-5 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Tọa độ
                </p>
                <p className='font-medium'>
                  Vĩ độ: {store?.latitude || 'Chưa cung cấp'}, Kinh độ:{' '}
                  {store?.longitude || 'Chưa cung cấp'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className='justify-end'>
        <Button
          variant='outline'
          onClick={() => router.push(`${PATH.STORES}/${store?.id}`)}
        >
          Xem Chi Tiết Cửa Hàng
        </Button>
      </CardFooter>
    </Card>
  );
};
export default StoreDetailsTab;
