'use client';

import BackButton from '@/components/back-btn/back-button';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageFallback, STORAGE } from '@/constant/storage';
import { PATH } from '@/enums/path';
import { useStoreById } from '@/hooks/use-store';
import { useStoreScheduleByStoreId } from '@/hooks/use-store-schedule';
import { getLocalStorageItem } from '@/utils/token';
import { Image } from 'antd';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import StoreInfo from './_components/store-info';
import StoreScheduleDisplay from './_components/store-schedule-display';

export default function StoreSchedulePage() {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const id = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);
    setStoreId(id);
  }, []);

  const { store, isLoading: storeLoading } = useStoreById(storeId || '');
  const { storeSchedulesRes, isLoading: storeScheduleLoading } =
    useStoreScheduleByStoreId(storeId || '');

  if (!isClient || storeLoading || storeScheduleLoading || !storeId) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='size-12 animate-spin duration-200' />
      </div>
    );
  }

  // Get main image if available
  const mainImage =
    store?.images?.find((img) => img.type === 'store_main')?.url ||
    (store?.images && store?.images.length > 0
      ? store?.images[0]?.url
      : '/No-Image-Placeholder.png');

  return (
    <section>
      <div className='flex items-center justify-between px-4'>
        <BackButton />
        <Button onClick={() => router.push(PATH.STORE_HOURS_EDIT)}>
          Chỉnh sửa
        </Button>
      </div>
      <div className='container mx-auto p-4 md:px-4 md:py-8'>
        {/* Store Header */}
        <div className='mb-6 overflow-hidden rounded-lg bg-background shadow-md'>
          <div className='relative flex h-64 items-center justify-center md:h-80'>
            <div className='absolute inset-0 flex items-center justify-center'>
              <Image
                src={mainImage}
                alt={store?.storeName || 'Tên cửa hàng'}
                className='h-full w-full object-cover'
                fallback={ImageFallback.SRC}
              />
              <div className='absolute inset-0 bg-black bg-opacity-30'></div>
            </div>
            <div className='absolute bottom-0 left-0 p-6'>
              <h2 className='mb-2 font-bold text-primary-foreground'>
                {store?.storeName || 'Tên cửa hàng'}
              </h2>
              <div className='flex items-center text-primary-foreground'>
                <p className='rounded bg-primary px-2.5 py-0.5 text-sm font-medium text-primary-foreground'>
                  {store?.type || 'Loại cửa hàng'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shadcn UI Tabs */}
        <Tabs defaultValue='info' className='mb-6 w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='info'>Thông tin</TabsTrigger>
            <TabsTrigger value='working-hours'>Giờ làm việc</TabsTrigger>
            <TabsTrigger value='photos'>Hình ảnh</TabsTrigger>
          </TabsList>

          {/* Info Tab Content */}
          <TabsContent
            value='info'
            className='mt-4 rounded-lg bg-background p-6 shadow-md'
          >
            <StoreInfo store={store} />
          </TabsContent>

          {/* Working Hours Tab Content */}
          <TabsContent
            value='working-hours'
            className='mt-4 rounded-lg bg-background p-6 shadow-md'
          >
            <div className='space-y-4'>
              <h2 className='mb-4 text-xl font-semibold'>Giờ làm việc</h2>
              <StoreScheduleDisplay
                storeSchedules={
                  Array.isArray(storeSchedulesRes) ? storeSchedulesRes : []
                }
              />
            </div>
          </TabsContent>

          {/* Photos Tab Content */}
          <TabsContent
            value='photos'
            className='mt-4 rounded-lg bg-background p-6 shadow-md'
          >
            <div className='space-y-4'>
              <h2 className='mb-4 text-xl font-semibold'>Hình ảnh cửa hàng</h2>
              {store?.images && store?.images.length > 0 ? (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
                  {store?.images?.map((image, index) => (
                    <div key={index}>
                      <Image
                        src={image?.url}
                        alt={image?.altText}
                        width={200}
                        fallback={ImageFallback.SRC}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className='rounded-lg bg-darker py-12 text-center opacity-90'>
                  <p className='text-zinc-500'>Hiện chưa có hình ảnh</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
