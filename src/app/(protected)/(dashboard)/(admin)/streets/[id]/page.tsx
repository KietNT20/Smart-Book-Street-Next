'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { useGetStreetById } from '@/hooks/use-street';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { ArrowLeft, MapPin, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Loading from './loading';

dayjs.locale('vi');

type Props = {
  params: { id: string };
};

export default function StreetDetailPage({ params }: Props) {
  const router = useRouter();
  const { streetRes, isLoadingStreet } = useGetStreetById(params.id);
  useEntityBreadcrumb(
    PATH.STREETS,
    'Đường sách',
    params.id,
    streetRes?.streetName
  );

  if (isLoadingStreet) {
    return <Loading />;
  }

  return (
    <>
      <Button variant='outline' size='sm' onClick={() => router.back()}>
        <ArrowLeft className='mr-2 h-4 w-4' />
        Quay lại
      </Button>
      <div className='container mx-auto space-y-6 py-6'>
        {/* Header */}
        <div className='flex items-center gap-4'>
          <div>
            <h1 className='text-3xl font-bold'>{streetRes?.streetName}</h1>
            <p className='mt-1 flex items-center gap-2 text-muted-foreground'>
              <MapPin className='h-4 w-4' />
              {streetRes?.address}
            </p>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Main Image */}
            {streetRes?.baseImgUrl && (
              <Card>
                <CardContent className='p-0'>
                  <div className='relative aspect-video w-full overflow-hidden rounded-lg'>
                    <Image
                      src={streetRes?.baseImgUrl}
                      alt={streetRes?.streetName}
                      fill
                      className='object-cover'
                      priority
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Mô tả</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='whitespace-pre-wrap leading-relaxed text-foreground'>
                  {streetRes?.description}
                </p>
              </CardContent>
            </Card>
            {/* Zones */}
            {streetRes?.zones && streetRes.zones.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Khu vực ({streetRes.zones.length})</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {streetRes.zones.map((zone: any) => (
                    <div
                      key={zone.id}
                      className='space-y-3 rounded-lg border p-4'
                    >
                      <div className='flex items-start justify-between'>
                        <h3 className='text-lg font-semibold'>
                          {zone.zoneName}
                        </h3>
                        <Badge variant='secondary'>Khu vực</Badge>
                      </div>
                      {zone.description && (
                        <p className='leading-relaxed text-muted-foreground'>
                          {zone.description}
                        </p>
                      )}
                      <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                        <span className='flex items-center gap-1'>
                          <MapPin className='h-4 w-4' />
                          {zone.latitude.toFixed(6)},{' '}
                          {zone.longitude.toFixed(6)}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            {/* Additional Images */}
            {streetRes?.images && streetRes.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Hình ảnh khác</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
                    {streetRes.images.map((image: any, index: number) => (
                      <div
                        key={index}
                        className='relative aspect-video overflow-hidden rounded-lg'
                      >
                        <Image
                          src={image.url || image}
                          alt={`${streetRes.streetName} - Ảnh ${index + 1}`}
                          fill
                          className='object-cover transition-transform duration-200 hover:scale-105'
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Location Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin vị trí</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-sm'>
                    <MapPin className='h-4 w-4 text-muted-foreground' />
                    <span className='font-medium'>Tọa độ:</span>
                  </div>
                  <div className='space-y-1 pl-6 text-sm text-muted-foreground'>
                    <p>Vĩ độ: {streetRes?.latitude}</p>
                    <p>Kinh độ: {streetRes?.longitude}</p>
                  </div>
                </div>
                <Separator />
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-sm'>
                    <MapPin className='h-4 w-4 text-muted-foreground' />
                    <span className='font-medium'>Địa chỉ:</span>
                  </div>
                  <p className='pl-6 text-sm leading-relaxed text-muted-foreground'>
                    {streetRes?.address}
                  </p>
                </div>
              </CardContent>
            </Card>
            {/* Meta Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin quản lý</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-3 text-sm'>
                  <div className='flex items-start gap-2'>
                    <User className='mt-0.5 h-4 w-4 text-muted-foreground' />
                    <div>
                      <p className='font-medium'>Người tạo:</p>
                      <p className='text-muted-foreground'>
                        {streetRes?.createdBy}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
