'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { useStoreById } from '@/hooks/use-store';
import {
  ArrowLeft,
  Clock,
  HandHeart,
  MapPin,
  Navigation,
  Store,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const UserStoresPage = ({ params }: { params: { id: string } }) => {
  const { store, isLoading } = useStoreById(params.id);

  useEntityBreadcrumb(
    PATH.USER_STORES,
    'Thông tin cửa hàng',
    params.id,
    store?.storeName || 'Cửa hàng'
  );

  if (isLoading) {
    return (
      <div className='container mx-auto p-4 md:px-24'>
        <div className='space-y-4'>
          <div className='h-8 animate-pulse rounded bg-muted'></div>
          <div className='h-64 animate-pulse rounded bg-muted'></div>
        </div>
      </div>
    );
  }

  const canRent = !store?.userStores || store.userStores.length === 0;
  const mainImage = store?.images?.find((img) => img.type === 'store_main');

  return (
    <div className='container mx-auto space-y-6 p-4 md:px-24'>
      {/* Header Actions */}
      <div className='flex items-center justify-between'>
        <Link href={PATH.USER_STORES}>
          <Button variant='outline'>
            <ArrowLeft className='mr-2 size-4' />
            Quay về
          </Button>
        </Link>

        {canRent ? (
          <Link href={`${PATH.USER_STORES}/${params.id}/rent`} passHref>
            <Button>
              <HandHeart className='mr-2 size-4' />
              Đăng ký thuê
            </Button>
          </Link>
        ) : (
          <Button disabled variant='secondary'>
            <HandHeart className='mr-2 size-4' />
            Đã có người thuê
          </Button>
        )}
      </div>

      {/* Store Header */}
      <Card>
        <CardHeader>
          <div className='flex flex-col gap-6 md:flex-row'>
            {/* Store Image */}
            <div className='relative h-64 w-full overflow-hidden rounded-lg bg-muted md:w-1/3'>
              {mainImage?.url && store?.storeName ? (
                <Image
                  src={mainImage.url}
                  alt={mainImage?.altText || store?.storeName}
                  fill
                  className='object-cover'
                />
              ) : (
                <div className='flex h-full items-center justify-center'>
                  <Store className='size-16 text-muted-foreground' />
                </div>
              )}
            </div>

            {/* Store Info */}
            <div className='flex-1 space-y-4'>
              <div>
                <CardTitle className='text-3xl'>
                  {store?.storeName || 'Chưa cung cấp'}
                </CardTitle>
                <div className='mt-2 flex items-center gap-2'>
                  <Badge variant='secondary'>{store?.type || 'Cửa hàng'}</Badge>
                  {!canRent && (
                    <Badge variant='destructive'>Đã được thuê</Badge>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex items-start gap-2'>
                  <MapPin className='mt-1 size-4 text-muted-foreground' />
                  <span className='text-sm'>
                    {store?.address || 'Chưa cung cấp'}
                  </span>
                </div>

                {(store?.openingTime || store?.closingTime) && (
                  <div className='flex items-center gap-2'>
                    <Clock className='size-4 text-muted-foreground' />
                    <span className='text-sm'>
                      {store?.openingTime && store?.closingTime
                        ? `${store.openingTime} - ${store.closingTime}`
                        : 'Giờ mở cửa chưa được cập nhật'}
                    </span>
                  </div>
                )}

                {store?.latitude && store?.longitude && (
                  <div className='flex items-center gap-2'>
                    <Navigation className='size-4 text-muted-foreground' />
                    <span className='text-sm'>
                      {store.latitude}, {store.longitude}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Zone Information */}
      {store?.zone && (
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Thông tin khu vực</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <h3 className='text-lg font-semibold'>{store.zone.zoneName}</h3>
              <p className='mt-2 leading-relaxed text-muted-foreground'>
                {store.zone.description}
              </p>
            </div>

            {store.zone.latitude && store.zone.longitude && (
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Navigation className='size-4' />
                <span>
                  Tọa độ khu vực: {store.zone.latitude}, {store.zone.longitude}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Additional Images */}
      {store?.images && store.images.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Hình ảnh khác</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
              {store.images
                .filter((img) => img.type !== 'store_main')
                .map((image, index) => (
                  <div
                    key={image.id || index}
                    className='relative aspect-square overflow-hidden rounded-lg bg-muted'
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || `Hình ảnh ${index + 1}`}
                      fill
                      className='object-cover'
                    />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserStoresPage;
