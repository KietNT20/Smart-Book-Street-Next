'use client';

import BackButton from '@/components/back-btn/back-button';
import LoadingSpinner from '@/components/spin/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageFallback } from '@/constant/storage';
import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { useStoreById } from '@/hooks/use-store';
import { Image } from 'antd';
import dayjs from 'dayjs';
import { Clock, Mail, Map as MapIcon, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export default function StorePage({ params }: { params: { storeId: string } }) {
  const { store, isLoading: storeLoading } = useStoreById(params.storeId);

  useEntityBreadcrumb(
    PATH.STORES,
    'Cửa hàng',
    params.storeId,
    store?.storeName
  );

  if (storeLoading) {
    return <LoadingSpinner />;
  }

  // Get main image if available
  const mainImage =
    store?.images?.find((img) => img.type === 'store_main')?.url ||
    (store?.images && store?.images?.length > 0
      ? store?.images[0]?.url
      : '/No-Image-Placeholder.png');

  return (
    <>
      <div className='flex items-center justify-between'>
        <BackButton />
        <Link href={`${PATH.STORES}/${params.storeId}/edit`}>
          <Button variant='darker'>Chỉnh sửa</Button>
        </Link>
      </div>

      <div className='container mx-auto p-4'>
        {/* Store Header */}
        <div className='mb-6 overflow-hidden rounded-lg bg-background shadow-md'>
          <div className='relative h-64 md:h-80'>
            <div className='absolute inset-0 flex items-center justify-center'>
              <Image
                src={mainImage}
                alt={store?.storeName || 'Store image'}
                className='h-full w-full object-cover'
                fallback={ImageFallback.SRC}
              />
              <div className='absolute inset-0 bg-black bg-opacity-30'></div>
            </div>
            <div className='absolute bottom-0 left-0 p-6'>
              <h1 className='mb-2 text-3xl font-bold text-white md:text-4xl'>
                {store?.storeName}
              </h1>
              {store?.type && (
                <span className='rounded bg-primary px-2.5 py-0.5 text-sm font-medium text-white'>
                  {store?.type}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue='info' className='mb-6 w-full'>
          <TabsList className='grid w-full grid-cols-5'>
            <TabsTrigger value='info'>Thông tin</TabsTrigger>
            <TabsTrigger value='map'>Bản đồ</TabsTrigger>
            <TabsTrigger value='photos'>Hình ảnh</TabsTrigger>
            <TabsTrigger value='inventory'>Tồn kho</TabsTrigger>
          </TabsList>

          {/* Info Tab */}
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
                      <h5 className='font-bold'>Địa chỉ</h5>
                      <p className='text-foreground'>
                        {store?.address || 'Chưa cập nhật'}
                      </p>
                    </div>
                  </div>

                  {store?.phone && (
                    <div className='flex items-start'>
                      <Phone className='mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-500' />
                      <div>
                        <h5 className='font-bold'>Số điện thoại</h5>
                        <p className='text-foreground'>{store?.phone}</p>
                      </div>
                    </div>
                  )}

                  {store?.email && (
                    <div className='flex items-start'>
                      <Mail className='mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-500' />
                      <div>
                        <h5 className='font-bold'>Email</h5>
                        <p className='text-foreground'>{store?.email}</p>
                      </div>
                    </div>
                  )}

                  {(store?.openingTime || store?.closingTime) && (
                    <div className='flex items-start'>
                      <Clock className='mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-500' />
                      <div>
                        <h5 className='font-bold'>Giờ mở cửa</h5>
                        <p className='text-foreground'>
                          {store?.openingTime && store?.closingTime
                            ? `${store?.openingTime} - ${store?.closingTime}`
                            : 'Liên hệ trực tiếp'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {store?.zone && (
                <div>
                  <h2 className='mb-4 text-xl font-bold'>Khu vực</h2>
                  <div className='rounded-lg border border-ring bg-card p-4'>
                    <h5 className='mb-2 text-lg font-semibold'>
                      {store?.zone?.zoneName}
                    </h5>
                    <p className='text-muted-foreground'>
                      {store?.zone?.description}
                    </p>
                    {store?.zone?.latitude && store?.zone?.longitude && (
                      <p className='mt-2 text-sm text-muted-foreground'>
                        Vị trí khu vực: {store?.zone?.latitude},{' '}
                        {store?.zone?.longitude}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Map Tab */}
          <TabsContent
            value='map'
            className='mt-4 rounded-lg bg-background p-6 shadow-md'
          >
            <div className='space-y-4'>
              <h2 className='mb-4 text-xl font-semibold'>Vị trí cửa hàng</h2>

              <div className='relative flex h-96 items-center justify-center rounded-lg bg-muted-foreground/5'>
                <div className='text-center'>
                  <MapIcon className='mx-auto mb-2 h-12 w-12 text-muted-foreground' />
                  <p className='text-foreground'>
                    Vị trí: {store?.latitude}, {store?.longitude}
                  </p>
                  <a
                    href={`https://www.google.com/maps?q=${store?.latitude},${store?.longitude}`}
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
                <p className='text-foreground'>{store?.address}</p>
              </div>
            </div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent
            value='photos'
            className='mt-4 rounded-lg bg-background p-6 shadow-md'
          >
            <div className='space-y-4'>
              <h2 className='mb-4 text-xl font-semibold'>Hình ảnh cửa hàng</h2>

              {store?.images && store?.images?.length > 0 ? (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
                  {store?.images?.map((image, index) => (
                    <div
                      key={index}
                      className='relative overflow-hidden rounded-lg border shadow'
                    >
                      <Image
                        src={image?.url}
                        alt={
                          image?.altText || store?.storeName || 'Store image'
                        }
                        className='h-48 w-full object-cover'
                        fallback={ImageFallback.SRC}
                      />
                      {image?.type === 'store_main' && (
                        <Badge className='absolute bottom-2 right-2 bg-primary'>
                          Ảnh chính
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className='rounded-lg py-12 text-center'>
                  <p className='text-zinc-500'>Hiện chưa có hình ảnh</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent
            value='inventory'
            className='mt-4 rounded-lg bg-background p-6 shadow-md'
          >
            <div className='space-y-4'>
              <h2 className='mb-4 text-xl font-semibold'>Danh sách tồn kho</h2>

              {store?.inventories && store?.inventories?.length > 0 ? (
                <div className='overflow-x-auto'>
                  <table className='w-full border-collapse'>
                    <thead>
                      <tr className='border-b bg-muted/50'>
                        <th className='px-4 py-2 text-left'>Mã sản phẩm</th>
                        <th className='px-4 py-2 text-left'>Số lượng</th>
                        <th className='px-4 py-2 text-left'>Còn hàng</th>
                        <th className='px-4 py-2 text-left'>Ngày cập nhật</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.inventories.map((item) => (
                        <tr
                          key={item.id}
                          className='border-b hover:bg-muted/30'
                        >
                          <td className='px-4 py-2'>
                            {item.entityId.substring(0, 8)}...
                          </td>
                          <td className='px-4 py-2'>{item.quantity}</td>
                          <td className='px-4 py-2'>
                            <Badge
                              variant={
                                item.isInStock ? 'matcha' : 'destructive'
                              }
                            >
                              {item.isInStock ? 'Còn hàng' : 'Hết hàng'}
                            </Badge>
                          </td>
                          <td className='px-4 py-2'>
                            {dayjs(item.lastUpdatedDate).format('DD/MM/YYYY')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className='rounded-lg py-12 text-center'>
                  <p className='text-zinc-500'>
                    Hiện chưa có thông tin tồn kho
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
