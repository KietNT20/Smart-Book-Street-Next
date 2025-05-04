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
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import StoreScheduleDisplay from './_components/store-schedule-display';

export default function StoreSchedulePage() {
  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);
  const { store, isLoading: storeLoading } = useStoreById(storeId);
  const { storeSchedulesRes, isLoading: storeScheduleLoading } =
    useStoreScheduleByStoreId(storeId);
  const router = useRouter();

  if (!store) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center p-4'>
        <h1 className='mb-2 text-2xl font-bold text-red-500'>
          Không tìm thấy cửa hàng
        </h1>
        <p className='text-zinc-600'>
          Cửa hàng này không tồn tại hoặc đã bị xóa.
        </p>
      </div>
    );
  }

  // Get main image if available
  const mainImage =
    store.images?.find((img) => img.type === 'store_main')?.url ||
    (store.images?.length > 0
      ? store.images[0].url
      : '/public/No-Image-Placeholder.png');

  if (storeLoading || storeScheduleLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary'></div>
      </div>
    );
  }

  return (
    <section>
      <div className='flex items-center justify-between'>
        <BackButton />
        <Button
          variant={'darker'}
          onClick={() => router.push(PATH.STORE_HOURS_EDIT)}
        >
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
                alt={store.storeName}
                className='h-full w-full object-cover'
                fallback={ImageFallback.SRC}
              />
              <div className='absolute inset-0 bg-black bg-opacity-30'></div>
            </div>
            <div className='absolute bottom-0 left-0 p-6'>
              <h1 className='mb-2 text-3xl font-bold text-primary-foreground md:text-4xl'>
                {store.storeName}
              </h1>
              <div className='flex items-center text-primary-foreground'>
                <span className='rounded bg-primary px-2.5 py-0.5 text-sm font-medium text-primary-foreground'>
                  {store.type}
                </span>
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
            <div className='space-y-6'>
              <div>
                <h2 className='mb-4 text-xl font-semibold'>
                  Thông tin liên hệ
                </h2>
                <div className='space-y-3'>
                  <div className='flex items-start'>
                    <MapPin className='mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-500' />
                    <div>
                      <h3 className='font-medium text-muted-foreground'>
                        Địa chỉ
                      </h3>
                      <p>{store.address}</p>
                    </div>
                  </div>
                  {store.phone && (
                    <div className='flex items-start'>
                      <Phone className='mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-500' />
                      <div>
                        <h3 className='font-medium text-muted-foreground'>
                          Số điện thoại
                        </h3>
                        <p>{store.phone}</p>
                      </div>
                    </div>
                  )}
                  {store.email && (
                    <div className='flex items-start'>
                      <Mail className='mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-500' />
                      <div>
                        <h3 className='font-medium text-muted-foreground'>
                          Email
                        </h3>
                        <p>{store.email}</p>
                      </div>
                    </div>
                  )}
                  {(store.openingTime || store.closingTime) && (
                    <div className='flex items-start'>
                      <Clock className='mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-500' />
                      <div>
                        <h3 className='font-medium'>Giờ mở cửa</h3>
                        <p className='text-zinc-600'>
                          {store.openingTime && store.closingTime
                            ? `${store.openingTime} - ${store.closingTime}`
                            : 'Liên hệ trực tiếp'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {store.zone && (
                <div>
                  <h2 className='mb-4 text-xl font-bold'>Khu vực</h2>
                  <div className='rounded-lg border p-4'>
                    <h3 className='mb-2 text-lg font-semibold'>
                      {store.zone.zoneName}
                    </h3>
                    <p>{store.zone.description}</p>
                  </div>
                </div>
              )}
            </div>
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
              {store.images && store.images.length > 0 ? (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
                  {store.images.map((image, index) => (
                    <div key={index}>
                      <Image
                        src={image.url}
                        alt={image.altText}
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
