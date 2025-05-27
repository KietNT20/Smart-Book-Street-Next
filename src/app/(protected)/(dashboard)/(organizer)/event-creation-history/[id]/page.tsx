'use client';

import { formatTimeString } from '@/app/(protected)/(dashboard)/(admin)/events/[id]/_utils/date-formatter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ImageFallback } from '@/constant/storage';
import { useGetEventById } from '@/hooks/use-event';
import { formatDateVi } from '@/lib/utils';
import dayjs from 'dayjs';
import DOMPurify from 'isomorphic-dompurify';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const EventDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  const { eventData, eventLoading } = useGetEventById(params.id);

  if (eventLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <Button variant='ghost' onClick={() => router.back()}>
        <ArrowLeft className='mr-2 h-4 w-4' />
        Quay lại
      </Button>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Left Column - 2/3 width */}
        <div className='space-y-6 lg:col-span-2'>
          <Card>
            <CardContent className='p-6'>
              <h2>Chi tiết sự kiện</h2>
              <p className='text-muted-foreground'>{eventData?.eventName}</p>
            </CardContent>
          </Card>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Calendar className='h-5 w-5' />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Tên sự kiện
                  </label>
                  <p className='font-medium'>{eventData?.eventName}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Email người tổ chức
                  </label>
                  <p>{eventData?.organizerEmail}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Ngày bắt đầu
                  </label>
                  <p>
                    {eventData?.startDate
                      ? formatDateVi(eventData?.startDate)
                      : 'Chưa có'}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Ngày kết thúc
                  </label>
                  <p>
                    {eventData?.endDate
                      ? formatDateVi(eventData?.endDate)
                      : 'Chưa có'}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Phiên bản
                  </label>
                  <p>{eventData?.version}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Số lượng đăng ký
                  </label>
                  <div className='flex items-center gap-1'>
                    <Users className='h-4 w-4 text-muted-foreground' />
                    <span>{eventData?.totalRegistrations}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <label className='text-sm font-medium text-muted-foreground'>
                  Mô tả sự kiện
                </label>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(eventData?.description || ''),
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='flex items-center justify-center p-4 pt-4'>
              <Image
                alt={eventData?.eventName || 'Ảnh sự kiện'}
                src={eventData?.baseImgUrl || ImageFallback.SRC}
                width={1200}
                height={300}
              />
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <MapPin className='h-5 w-5' />
                Thông tin địa điểm
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Khu vực
                  </label>
                  <p className='font-medium'>{eventData?.zone?.zoneName}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Đường
                  </label>
                  <p>{eventData?.zone?.street?.streetName}</p>
                </div>
              </div>

              <div>
                <label className='text-sm font-medium text-muted-foreground'>
                  Địa chỉ
                </label>
                <p className='text-sm'>{eventData?.zone?.street?.address}</p>
              </div>

              <div>
                <label className='text-sm font-medium'>Mô tả khu vực</label>
                <p className='text-sm text-muted-foreground'>
                  {eventData?.zone?.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Event Schedules */}
          {eventData?.eventSchedules && eventData.eventSchedules.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Clock className='h-5 w-5' />
                  Lịch trình sự kiện
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='rounded-md border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-16'>STT</TableHead>
                        <TableHead>Ngày diễn ra</TableHead>
                        <TableHead>Giờ bắt đầu</TableHead>
                        <TableHead>Giờ kết thúc</TableHead>
                        <TableHead>Thời lượng</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventData.eventSchedules.map((schedule, index) => {
                        const startTime = dayjs(
                          `2000-01-01 ${schedule.startTime}`
                        );
                        const endTime = dayjs(`2000-01-01 ${schedule.endTime}`);
                        const duration = endTime.diff(startTime, 'hour', true);

                        return (
                          <TableRow key={schedule.id}>
                            <TableCell className='text-center text-muted-foreground'>
                              {index + 1}
                            </TableCell>
                            <TableCell className='font-medium'>
                              <div className='flex items-center gap-2'>
                                <Calendar className='h-4 w-4 text-muted-foreground' />
                                {dayjs(schedule.eventDate).format('DD/MM/YYYY')}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center gap-2'>
                                <Clock className='h-4 w-4 text-muted-foreground' />
                                {formatTimeString(schedule.startTime)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center gap-2'>
                                <Clock className='h-4 w-4 text-muted-foreground' />
                                {formatTimeString(schedule.endTime)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant='secondary'>{duration} giờ</Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin thời gian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Ngày tạo
                  </label>
                  <p className='text-sm'>
                    {dayjs(eventData?.createdDate).format(
                      'DD/MM/YYYY HH:mm:ss'
                    )}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Cập nhật lần cuối
                  </label>
                  <p className='text-sm'>
                    {dayjs(eventData?.lastUpdatedDate).format(
                      'DD/MM/YYYY HH:mm:ss'
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className='space-y-6 lg:col-span-1'>
          {/* Status Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <AlertCircle className='h-5 w-5' />
                Trạng thái sự kiện
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Trạng thái duyệt:</span>
                  <Badge
                    variant={eventData?.isApprove ? 'default' : 'destructive'}
                  >
                    {eventData?.isApprove ? (
                      <>
                        <CheckCircle className='mr-1 h-3 w-3' />
                        Đã duyệt
                      </>
                    ) : (
                      <>
                        <XCircle className='mr-1 h-3 w-3' />
                        Chưa duyệt
                      </>
                    )}
                  </Badge>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Trạng thái mở:</span>
                  <Badge variant={eventData?.isOpen ? 'default' : 'secondary'}>
                    {eventData?.isOpen ? 'Đang mở' : 'Đã đóng'}
                  </Badge>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>
                    Cho phép quảng cáo:
                  </span>
                  <Badge
                    variant={eventData?.allowAds ? 'default' : 'secondary'}
                  >
                    {eventData?.allowAds ? 'Có' : 'Không'}
                  </Badge>
                </div>

                {eventData?.message && (
                  <>
                    <Separator className='my-4' />
                    <div>
                      <label className='text-sm font-medium text-muted-foreground'>
                        Ghi chú:
                      </label>
                      <p className='mt-1 text-sm text-destructive'>
                        {eventData?.message}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
