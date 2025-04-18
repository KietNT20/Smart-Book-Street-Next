'use client';

import BackButton from '@/components/back-btn/back-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStoreById } from '@/hooks/use-store';
import { Image } from 'antd';
import { Clock, Mail, Map as MapIcon, MapPin, Phone } from 'lucide-react';

export default function StorePage({ params }: { params: { storeId: string } }) {
  const { store, isLoading } = useStoreById(params.storeId);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary'></div>
      </div>
    );
  }

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

  return (
    <>
      <BackButton />
      <div className='container mx-auto max-w-6xl px-4 py-8'>
        {/* Store Header */}
        <div className='mb-6 overflow-hidden rounded-lg bg-white shadow-md'>
          <div className='relative h-64 md:h-80'>
            <div className='absolute inset-0'>
              <Image
                src={mainImage}
                alt={store.storeName}
                className='h-full w-full object-cover'
              />
              <div className='absolute inset-0 bg-black bg-opacity-30'></div>
            </div>
            <div className='absolute bottom-0 left-0 p-6'>
              <h1 className='mb-2 text-3xl font-bold text-white md:text-4xl'>
                {store.storeName}
              </h1>
              <div className='flex items-center text-white'>
                <span className='rounded bg-primary px-2.5 py-0.5 text-sm font-medium text-white'>
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
            <TabsTrigger value='map'>Bản đồ</TabsTrigger>
            <TabsTrigger value='photos'>Hình ảnh</TabsTrigger>
          </TabsList>

          {/* Info Tab Content */}
          <TabsContent
            value='info'
            className='mt-4 rounded-lg bg-white p-6 shadow-md'
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
                      <h3 className='font-medium'>Địa chỉ</h3>
                      <p className='text-zinc-600'>{store.address}</p>
                    </div>
                  </div>
                  {store.phone && (
                    <div className='flex items-start'>
                      <Phone className='mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-500' />
                      <div>
                        <h3 className='font-medium'>Số điện thoại</h3>
                        <p className='text-zinc-600'>{store.phone}</p>
                      </div>
                    </div>
                  )}
                  {store.email && (
                    <div className='flex items-start'>
                      <Mail className='mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-500' />
                      <div>
                        <h3 className='font-medium'>Email</h3>
                        <p className='text-zinc-600'>{store.email}</p>
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
                  <h2 className='mb-4 text-xl font-semibold'>Khu vực</h2>
                  <div className='rounded-lg bg-gray-50 p-4'>
                    <h3 className='mb-2 text-lg font-medium'>
                      {store.zone.zoneName}
                    </h3>
                    <p className='text-zinc-600'>{store.zone.description}</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Map Tab Content */}
          <TabsContent
            value='map'
            className='mt-4 rounded-lg bg-white p-6 shadow-md'
          >
            <div className='space-y-4'>
              <h2 className='mb-4 text-xl font-semibold'>Vị trí cửa hàng</h2>
              {/* Map placeholder - in a real app, implement an actual map here */}
              <div className='relative flex h-96 items-center justify-center rounded-lg bg-gray-100'>
                <div className='text-center'>
                  <MapIcon className='mx-auto mb-2 h-12 w-12 text-zinc-400' />
                  <p className='text-zinc-600'>
                    Vị trí: {store.latitude}, {store.longitude}
                  </p>
                  <a
                    href={`https://www.google.com/maps?q=${store.latitude},${store.longitude}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='mt-4 inline-block rounded bg-primary px-4 py-2 text-white hover:bg-primary/90'
                  >
                    Xem trên Google Maps
                  </a>
                </div>
              </div>
              <div className='mt-4'>
                <h3 className='mb-2 font-medium'>Địa chỉ</h3>
                <p className='text-zinc-600'>{store.address}</p>
              </div>
            </div>
          </TabsContent>

          {/* Photos Tab Content */}
          <TabsContent
            value='photos'
            className='mt-4 rounded-lg bg-white p-6 shadow-md'
          >
            <div className='space-y-4'>
              <h2 className='mb-4 text-xl font-semibold'>Hình ảnh cửa hàng</h2>
              {store.images && store.images.length > 0 ? (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
                  {store.images.map((image, index) => (
                    <div
                      key={index}
                      className='h-64 overflow-hidden rounded-lg bg-gray-100'
                    >
                      <Image
                        src={image.url}
                        alt={`${store.storeName} - Ảnh ${index + 1}`}
                        className='h-full w-full object-cover'
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className='rounded-lg bg-gray-50 py-12 text-center'>
                  <p className='text-zinc-500'>Hiện chưa có hình ảnh</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
