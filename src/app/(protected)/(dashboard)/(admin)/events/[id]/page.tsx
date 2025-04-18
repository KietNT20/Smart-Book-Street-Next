'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import useDebounce from '@/hooks/use-debounce';
import { useGetEventById } from '@/hooks/use-event';
import { Image } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { BarChart4, Calendar, Clock, MapPin, Video } from 'lucide-react';

// Set locale cho dayjs
dayjs.locale('vi');

export default function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { eventData, eventLoading } = useGetEventById(params.id);
  const isLoading = useDebounce(eventLoading, 300);

  if (isLoading) {
    return (
      <div className='mx-auto mt-8 max-w-6xl p-4'>
        <div className='mb-8 h-96 w-full'>
          <Skeleton className='h-full w-full rounded-xl' />
        </div>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div className='space-y-6 md:col-span-2'>
            <Skeleton className='h-64 w-full rounded-xl' />
            <Skeleton className='h-64 w-full rounded-xl' />
          </div>
          <div className='space-y-6'>
            <Skeleton className='h-48 w-full rounded-xl' />
            <Skeleton className='h-64 w-full rounded-xl' />
          </div>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <Alert variant='destructive' className='max-w-lg'>
          <AlertTitle>Không tìm thấy sự kiện</AlertTitle>
          <AlertDescription>
            Không thể tìm thấy thông tin sự kiện đã cung cấp.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatTime = (dateString: string | Date | null): string => {
    return dayjs(dateString).format('HH:mm');
  };

  // Format range dates
  const formatDateRange = () => {
    const startDate = dayjs(eventData.startDate);
    const endDate = dayjs(eventData.endDate);

    if (startDate.isSame(endDate, 'day')) {
      return startDate.format('DD/MM/YYYY');
    }

    return `${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')}`;
  };

  return (
    <div className='min-h-screen bg-background pb-16'>
      {/* Hero Section */}
      <div className='relative h-96 w-full overflow-hidden'>
        <div className='absolute inset-0 z-10 bg-black/50'></div>
        <Image src={eventData.baseImgUrl} alt={eventData.eventName} />
        <div className='absolute inset-0 z-20 mx-auto flex max-w-6xl flex-col justify-end p-8 text-white'>
          <Badge
            className={`mb-4 w-fit ${eventData.isOpen ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {eventData.isOpen ? 'Đang diễn ra' : 'Đã kết thúc'}
          </Badge>
          <h1 className='mb-4 text-4xl font-bold'>{eventData.eventName}</h1>
          <div className='flex flex-col gap-4 text-gray-100 sm:flex-row sm:items-center'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              <span>{formatDateRange()}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='h-5 w-5' />
              <span>
                {formatTime(eventData.startDate)} -{' '}
                {formatTime(eventData.endDate)}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <MapPin className='h-5 w-5' />
              <span>{eventData.zone.zoneName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='mx-auto mt-8 max-w-6xl px-4'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          {/* Main Content */}
          <div className='space-y-8 md:col-span-2'>
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chi tiết</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='leading-relaxed text-gray-700'>
                  {eventData.description}
                </p>
              </CardContent>
            </Card>

            {/* Video Preview */}
            {eventData.videoLink && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Video className='h-5 w-5' />
                    Video giới thiệu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='aspect-video overflow-hidden rounded-lg'>
                    <video
                      src={eventData.videoLink}
                      controls
                      className='h-full w-full object-cover'
                      poster={eventData.baseImgUrl}
                    >
                      Trình duyệt của bạn không hỗ trợ video.
                    </video>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Statistics */}
            {(eventData.ageChart?.length > 0 ||
              eventData.genderChart?.length > 0 ||
              eventData.referenceChart?.length > 0 ||
              eventData.addressChart?.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BarChart4 className='h-5 w-5' />
                    Thống kê người tham gia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                    {/* Charts would go here, simplified for this example */}
                    <div className='flex h-64 items-center justify-center rounded-lg bg-gray-100 p-4'>
                      <p className='text-gray-500'>
                        Biểu đồ độ tuổi người tham gia
                      </p>
                    </div>
                    <div className='flex h-64 items-center justify-center rounded-lg bg-gray-100 p-4'>
                      <p className='text-gray-500'>
                        Biểu đồ giới tính người tham gia
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {eventData.baseImgUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Hình ảnh sự kiện</CardTitle>
                </CardHeader>
                <CardContent>
                  {eventData.baseImgUrl && (
                    <Image
                      src={eventData.baseImgUrl}
                      alt={eventData.eventName || 'Ảnh chính của sự kiện'}
                    />
                  )}
                  <Image.PreviewGroup
                    items={eventData.images.map((image) => image.url)}
                  >
                    <div className='mt-4 grid grid-cols-2 gap-4 md:grid-cols-3'>
                      {eventData.images.map((image, index) => (
                        <div
                          key={index}
                          className='aspect-square overflow-hidden rounded-lg'
                        >
                          <Image
                            src={
                              image.url || '/public/No-Image-Placeholder.png'
                            }
                            alt={image.altText || `Hình ảnh ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </Image.PreviewGroup>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Event Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Tham gia sự kiện</CardTitle>
                {!eventData.isOpen && (
                  <CardDescription className='text-red-500'>
                    Sự kiện này đã kết thúc
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex flex-col gap-2'>
                  <p className='text-sm font-medium'>Chia sẻ sự kiện</p>
                  <div className='flex gap-2'>
                    <Button variant='outline' size='icon'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        fill='currentColor'
                        className='bi bi-facebook'
                        viewBox='0 0 16 16'
                      >
                        <path d='M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z' />
                      </svg>
                    </Button>
                    <Button variant='outline' size='icon'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        fill='currentColor'
                        className='bi bi-twitter-x'
                        viewBox='0 0 16 16'
                      >
                        <path d='M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z' />
                      </svg>
                    </Button>
                    <Button variant='outline' size='icon'>
                      <svg
                        viewBox='0 0 24 24'
                        width='16'
                        height='16'
                        stroke='currentColor'
                        strokeWidth='2'
                        fill='none'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <path d='M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8' />
                        <polyline points='16 6 12 2 8 6' />
                        <line x1='12' y1='2' x2='12' y2='15' />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Info */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <MapPin className='h-5 w-5' />
                  Địa điểm
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <h4 className='font-medium text-gray-900'>
                    {eventData.zone.zoneName}
                  </h4>
                  <p className='mt-1 text-sm text-gray-500'>
                    {eventData.zone.street.address}
                  </p>
                </div>

                <div className='h-48 overflow-hidden rounded-lg bg-gray-200'>
                  {/* Map placeholder */}
                  <div className='flex h-full w-full items-center justify-center bg-gray-100'>
                    <MapPin className='h-8 w-8 text-gray-400' />
                  </div>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <h4 className='font-medium'>Về địa điểm</h4>
                  <p className='text-sm text-gray-500'>
                    {eventData.zone.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Date and Time Information */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Calendar className='h-5 w-5' />
                  Thời gian
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-500'>Ngày bắt đầu</p>
                    <p className='font-medium'>
                      {dayjs(eventData.startDate).format('DD/MM/YYYY')}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Giờ bắt đầu</p>
                    <p className='font-medium'>
                      {dayjs(eventData.startDate).format('HH:mm')}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-500'>Ngày kết thúc</p>
                    <p className='font-medium'>
                      {dayjs(eventData.endDate).format('DD/MM/YYYY')}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Giờ kết thúc</p>
                    <p className='font-medium'>
                      {dayjs(eventData.endDate).format('HH:mm')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
