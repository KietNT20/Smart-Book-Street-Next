'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import {
  useApproveEventCreateRequest,
  useGetEventById,
} from '@/hooks/use-event';
import { formatDateVi } from '@/lib/utils';
import DOMPurify from 'isomorphic-dompurify';
import {
  Calendar,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Megaphone,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function EventCreateRequestPage({
  params,
}: {
  params: { id: string };
}) {
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const { eventData, eventLoading } = useGetEventById(params.id);
  const { approveEventCreateRequest, isApprovingEventCreateRequest } =
    useApproveEventCreateRequest();

  useEntityBreadcrumb(
    PATH.EVENT_CREATION_REQUEST,
    'Yêu cầu tạo sự kiện',
    params.id,
    eventData?.eventName
  );

  const handleApprove = () => {
    const formData = new FormData();
    formData.append('Message', '');
    formData.append('IsApprove', 'true');

    approveEventCreateRequest({
      id: params.id,
      data: formData,
    });
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('Message', rejectionReason);
      formData.append('IsApprove', 'false');

      approveEventCreateRequest({
        id: params.id,
        data: formData,
      });
    } catch (error) {
      console.error('Error rejecting event:', error);
    }
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // Remove seconds
  };

  const getApprovalStatus = (isApprove: boolean | null) => {
    if (isApprove === null)
      return { text: 'Chờ duyệt', variant: 'secondary' as const };
    if (isApprove === true)
      return { text: 'Đã duyệt', variant: 'default' as const };
    return { text: 'Từ chối', variant: 'destructive' as const };
  };

  if (eventLoading) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='mx-auto mb-4 size-8 animate-spin border-primary' />
          <p className='text-muted-foreground'>Đang tải thông tin sự kiện...</p>
        </div>
      </div>
    );
  }

  const approvalStatus = getApprovalStatus(eventData?.isApprove || null);

  return (
    <div className='container mx-auto p-6'>
      <div className='grid grid-cols-12 gap-6'>
        {/* Left Column - Event Details */}
        <div className='col-span-8'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>
                  <p>{eventData?.eventName}</p>
                  <span className='text-xs font-medium text-muted-foreground'>
                    Phiên bản: {eventData?.version}
                  </span>
                </CardTitle>
                <Badge variant={approvalStatus.variant}>
                  {approvalStatus.text}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Event Image */}
              {eventData?.baseImgUrl && (
                <div className='relative'>
                  <Image
                    src={eventData?.baseImgUrl}
                    alt={eventData?.eventName}
                    width={900}
                    height={500}
                    className='h-auto w-full'
                  />
                </div>
              )}

              {/* Basic Information */}
              <div className='space-y-4'>
                <div className='space-y-4'>
                  <Label className='text-base font-semibold'>
                    Nội dung sự kiện
                  </Label>
                  <Card>
                    <CardContent className='p-4'>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            eventData?.description || ''
                          ),
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='size-4 text-muted-foreground' />
                    <div>
                      <Label className='text-sm font-semibold'>
                        Ngày bắt đầu
                      </Label>
                      <p className='text-sm'>
                        {eventData?.startDate
                          ? formatDateVi(eventData?.startDate)
                          : 'Không có'}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Calendar className='size-4 text-muted-foreground' />
                    <div>
                      <Label className='text-sm font-semibold'>
                        Ngày kết thúc
                      </Label>
                      <p className='text-sm'>
                        {eventData?.endDate
                          ? formatDateVi(eventData?.endDate)
                          : 'Không có'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Location Information */}
              <div className='space-y-4'>
                <Label className='flex items-center gap-2 text-base font-semibold'>
                  <MapPin className='size-4' />
                  Thông tin địa điểm
                </Label>
                <Card>
                  <CardContent className='space-y-4 p-4'>
                    <div>
                      <Label className='text-sm font-semibold'>Khu vực</Label>
                      <p className='text-sm'>{eventData?.zone?.zoneName}</p>
                    </div>
                    <div>
                      <Label className='text-sm font-semibold'>
                        Đường sách
                      </Label>
                      <p className='text-sm'>
                        {eventData?.zone?.street?.streetName}
                      </p>
                    </div>
                    <div>
                      <Label className='text-sm font-semibold'>Địa chỉ</Label>
                      <p className='text-sm'>
                        {eventData?.zone?.street?.address}
                      </p>
                    </div>
                    <div>
                      <Label className='text-sm font-semibold'>
                        Mô tả khu vực
                      </Label>
                      <p className='text-sm'>{eventData?.zone?.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Event Schedules */}
              <div className='space-y-4'>
                <Label className='flex items-center gap-2 text-base font-semibold'>
                  <Clock className='size-4' />
                  Lịch trình sự kiện
                </Label>
                <div className='space-y-2'>
                  <Table className='border'>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ngày</TableHead>
                        <TableHead>Giờ bắt đầu</TableHead>
                        <TableHead>Giờ kết thúc</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventData?.eventSchedules?.map((schedule) => (
                        <TableRow key={schedule.id}>
                          <TableCell>
                            {formatDateVi(schedule.eventDate)}
                          </TableCell>
                          <TableCell>
                            {formatTime(schedule.startTime)}
                          </TableCell>
                          <TableCell>{formatTime(schedule.endTime)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Additional Information */}
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <Card>
                  <CardContent className='flex items-center gap-2 p-6'>
                    <Mail className='size-4 text-muted-foreground' />
                    {eventData?.organizerEmail || 'Không có'}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className='flex items-center gap-2 p-6'>
                    <Megaphone className='size-4 text-muted-foreground' />
                    {eventData?.allowAds
                      ? 'Có quảng cáo'
                      : 'Không có quảng cáo'}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Approval Actions */}
        <div className='col-span-4'>
          <Card className='sticky top-6'>
            <CardHeader>
              <CardTitle>Kiểm duyệt sự kiện</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {eventData?.isApprove === null ? (
                <>
                  <div className='space-y-2'>
                    <Button
                      className='w-full'
                      onClick={handleApprove}
                      disabled={isApprovingEventCreateRequest}
                    >
                      {isApprovingEventCreateRequest
                        ? 'Đang xử lý...'
                        : 'Chấp nhận'}
                    </Button>

                    <Button
                      variant='destructive'
                      className='w-full'
                      onClick={handleReject}
                      disabled={
                        isApprovingEventCreateRequest || !rejectionReason.trim()
                      }
                    >
                      {isApprovingEventCreateRequest
                        ? 'Đang xử lý...'
                        : 'Từ chối'}
                    </Button>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='rejection-reason'>
                      Lý do từ chối (nếu có)
                    </Label>
                    <Textarea
                      id='rejection-reason'
                      placeholder='Nhập lý do từ chối sự kiện...'
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={4}
                      disabled={isApprovingEventCreateRequest}
                    />
                  </div>
                </>
              ) : (
                <div className='space-y-4 text-center'>
                  <Badge
                    variant={approvalStatus.variant}
                    className='px-4 py-2 text-base'
                  >
                    {approvalStatus.text}
                  </Badge>

                  {eventData?.message && (
                    <div className='space-y-2'>
                      <Label className='text-sm font-medium'>Ghi chú</Label>
                      <div className='rounded-lg bg-muted/50 p-3'>
                        <p className='text-sm text-muted-foreground'>
                          {eventData?.message}
                        </p>
                      </div>
                    </div>
                  )}

                  <p className='text-sm text-muted-foreground'>
                    Sự kiện này đã được xử lý
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
