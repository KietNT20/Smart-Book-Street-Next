'use client';

import { ConfirmModal } from '@/components/confirm-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PATH } from '@/enums/path';
import { StoreRent, StoreRentLabels } from '@/enums/store-rent';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { useStoreById } from '@/hooks/use-store';
import {
  useDownloadUserStoreContract,
  useUserStoreByStoreId,
  useUserStoresMutation,
} from '@/hooks/use-user-store';
import dayjs from 'dayjs';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  HandHeart,
  Loader2,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Store,
  Trash2,
  User,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type Props = {
  params: { id: string };
};

const StoreRentalContractPage = ({ params }: Props) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { userStoreByStore, isLoadingUserStore } = useUserStoreByStoreId(
    params.id
  );
  const { store: storeDetail, isLoading: storeLoading } = useStoreById(
    params.id
  );
  const { deleteUserStore, isDeletingUserStore } = useUserStoresMutation();

  const rentalContract = userStoreByStore?.[0];
  const tenant = rentalContract?.user;
  const canRent =
    rentalContract?.status === StoreRent.ACTIVE &&
    rentalContract?.contractFileUrl !== null;
  const { contractDownload, isPendingContract } =
    useDownloadUserStoreContract();

  useEntityBreadcrumb(
    PATH.USER_STORES,
    'Hợp đồng thuê cửa hàng',
    params.id,
    storeDetail?.storeName || 'Cửa hàng'
  );

  const handleDeleteContract = () => {
    if (!rentalContract || !rentalContract.userId) return;

    deleteUserStore({
      userId: rentalContract.userId,
      storeId: params.id,
    });
    setShowDeleteDialog(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDownloadContract = () => {
    if (rentalContract?.contractFileUrl) {
      contractDownload({
        userId: rentalContract.userId,
        storeId: params.id,
      });
    }
  };

  if (isLoadingUserStore || storeLoading) {
    return (
      <div className='container mx-auto p-4 md:px-24'>
        <div className='space-y-4'>
          <div className='h-8 animate-pulse rounded bg-muted'></div>
          <div className='h-64 animate-pulse rounded bg-muted'></div>
          <div className='h-8 animate-pulse rounded bg-muted'></div>
          <div className='h-8 animate-pulse rounded bg-muted'></div>
          <div className='h-8 animate-pulse rounded bg-muted'></div>
          <div className='h-8 animate-pulse rounded bg-muted'></div>
        </div>
      </div>
    );
  }

  if (!rentalContract && !storeDetail) {
    return (
      <div className='container mx-auto p-4 md:px-24'>
        <Card>
          <CardContent className='p-6 text-center'>
            <AlertTriangle className='mx-auto mb-4 size-12 text-muted-foreground' />
            <p className='text-muted-foreground'>
              Không tìm thấy thông tin cửa hàng hoặc hợp đồng thuê.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case StoreRent.ACTIVE:
        return 'default';
      case StoreRent.TERMINATED:
        return 'destructive';
      case StoreRent.EXPIRED:
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case StoreRent.ACTIVE:
        return <CheckCircle className='size-4' />;
      case StoreRent.TERMINATED:
        return <XCircle className='size-4' />;
      case StoreRent.EXPIRED:
        return <AlertTriangle className='size-4' />;
      default:
        return null;
    }
  };

  const mainImage = storeDetail?.images?.find(
    (img) => img.type === 'store_main'
  );
  const additionalImages =
    storeDetail?.images?.filter((img) => img.type !== 'store_main') || [];

  const startDate = rentalContract ? dayjs(rentalContract.startDate) : null;
  const endDate = rentalContract ? dayjs(rentalContract.endDate) : null;
  const contractDuration =
    startDate && endDate ? endDate.diff(startDate, 'month') : 0;

  return (
    <div className='container mx-auto space-y-6 p-4 md:px-24'>
      {/* Header Actions */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <Link href={PATH.USER_STORES}>
          <Button variant='outline' className='w-full sm:w-auto'>
            <ArrowLeft className='mr-2 size-4' />
            <span className='hidden sm:inline'>Quay về danh sách</span>
            <span className='sm:hidden'>Quay về</span>
          </Button>
        </Link>

        {/* Action buttons - Stack on mobile, horizontal on desktop */}
        <div className='flex flex-col gap-2 sm:flex-row sm:gap-2'>
          {rentalContract?.contractFileUrl && (
            <Button
              onClick={handleDownloadContract}
              variant='outline'
              disabled={isPendingContract}
              className={`w-full sm:w-auto ${
                isPendingContract ? 'cursor-not-allowed opacity-70' : ''
              }`}
            >
              {isPendingContract ? (
                <>
                  <Loader2 className='mr-2 size-4 animate-spin' />
                  <span className='hidden sm:inline'>Đang tải xuống...</span>
                  <span className='sm:hidden'>Tải...</span>
                </>
              ) : (
                <>
                  <Download className='mr-2 size-4' />
                  <span className='hidden sm:inline'>Tải hợp đồng</span>
                  <span className='sm:hidden'>Tải</span>
                </>
              )}
            </Button>
          )}

          {rentalContract && (
            <Button
              variant='destructive'
              onClick={handleDeleteClick}
              disabled={isDeletingUserStore}
              className='w-full sm:w-auto'
            >
              <Trash2 className='mr-2 size-4' />
              <span className='hidden sm:inline'>
                {isDeletingUserStore ? 'Đang hủy...' : 'Chấm dứt hợp đồng'}
              </span>
              <span className='sm:hidden'>
                {isDeletingUserStore ? 'Hủy...' : 'Chấm dứt'}
              </span>
            </Button>
          )}

          {canRent ? (
            <Link href={`${PATH.USER_STORES}/${params.id}/rent`} passHref>
              <Button className='w-full sm:w-auto'>
                <HandHeart className='mr-2 size-4' />
                <span className='hidden sm:inline'>Đăng ký thuê</span>
                <span className='sm:hidden'>Thuê</span>
              </Button>
            </Link>
          ) : (
            <Button disabled variant='secondary' className='w-full sm:w-auto'>
              <HandHeart className='mr-2 size-4' />
              <span className='hidden sm:inline'>Đã có người thuê</span>
              <span className='sm:hidden'>Đã thuê</span>
            </Button>
          )}
        </div>
      </div>

      {/* Store Hero Section */}
      <Card className='overflow-hidden'>
        <div className='relative h-64 md:h-96'>
          {mainImage?.url ? (
            <Image
              src={mainImage.url}
              alt={
                mainImage?.altText || storeDetail?.storeName || 'Store image'
              }
              fill
              className='object-cover'
            />
          ) : (
            <div className='flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5'>
              <Store className='size-24 text-primary/50' />
            </div>
          )}
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
          <div className='absolute bottom-6 left-6 text-white'>
            <h1 className='mb-2 text-3xl font-bold'>
              {storeDetail?.storeName}
            </h1>
            <div className='flex items-center gap-4'>
              <Badge
                variant='secondary'
                className='border-white/30 bg-white/20 text-white'
              >
                {storeDetail?.type || 'Cửa hàng'}
              </Badge>
              {rentalContract ? (
                <Badge
                  variant={getStatusBadgeVariant(rentalContract.status)}
                  className='flex items-center gap-1'
                >
                  {getStatusIcon(rentalContract.status)}
                  {StoreRentLabels[rentalContract.status as StoreRent] ||
                    rentalContract.status}
                </Badge>
              ) : (
                <Badge
                  variant='destructive'
                  className='flex items-center gap-1'
                >
                  <XCircle className='size-4' />
                  Đang trống
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Contract Information */}
      {rentalContract && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='size-5' />
              Thông tin hợp đồng
            </CardTitle>
            <p className='text-muted-foreground'>
              Số hợp đồng: {rentalContract.contractNumber}
            </p>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Contract Status */}
            <div className='flex items-center justify-center rounded-lg border bg-gradient-to-r from-muted/30 to-muted/10 p-4'>
              <div className='flex items-center gap-3'>
                <div
                  className={`flex size-12 items-center justify-center rounded-full ${
                    rentalContract.status === StoreRent.ACTIVE
                      ? 'bg-green-100 dark:bg-green-900'
                      : rentalContract.status === StoreRent.TERMINATED
                        ? 'bg-red-100 dark:bg-red-900'
                        : 'bg-yellow-100 dark:bg-yellow-900'
                  }`}
                >
                  {getStatusIcon(rentalContract.status)}
                </div>
                <div className='flex items-center gap-2'>
                  <Badge
                    variant={getStatusBadgeVariant(rentalContract.status)}
                    className='flex items-center gap-1 px-3 py-1 text-sm'
                  >
                    {getStatusIcon(rentalContract.status)}
                    {StoreRentLabels[rentalContract.status as StoreRent] ||
                      rentalContract.status}
                  </Badge>
                  {rentalContract.status === StoreRent.ACTIVE && (
                    <span className='text-sm font-medium text-green-600 dark:text-green-400'>
                      • Hợp đồng đang có hiệu lực
                    </span>
                  )}
                  {rentalContract.status === StoreRent.TERMINATED && (
                    <span className='text-sm font-medium text-red-600 dark:text-red-400'>
                      • Hợp đồng đã chấm dứt
                    </span>
                  )}
                  {rentalContract.status === StoreRent.EXPIRED && (
                    <span className='text-sm font-medium text-yellow-600 dark:text-yellow-400'>
                      • Hợp đồng đã hết hạn
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contract Timeline */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='rounded-lg bg-primary/5 p-4 text-center'>
                <Calendar className='mx-auto mb-2 size-6 text-primary' />
                <p className='text-sm text-muted-foreground'>Ngày bắt đầu</p>
                <p className='text-lg font-semibold text-primary'>
                  {startDate?.format('DD/MM/YYYY')}
                </p>
              </div>
              <div className='rounded-lg bg-muted/50 p-4 text-center'>
                <Clock className='mx-auto mb-2 size-6 text-muted-foreground' />
                <p className='text-sm text-muted-foreground'>Thời gian thuê</p>
                <p className='text-lg font-semibold'>
                  {contractDuration} tháng
                </p>
              </div>
              <div className='rounded-lg bg-destructive/5 p-4 text-center'>
                <Calendar className='mx-auto mb-2 size-6 text-destructive' />
                <p className='text-sm text-muted-foreground'>Ngày kết thúc</p>
                <p className='text-lg font-semibold text-destructive'>
                  {endDate?.format('DD/MM/YYYY')}
                </p>
              </div>
            </div>

            {rentalContract.notes && (
              <>
                <Separator />
                <div className='rounded-lg bg-muted/30 p-4'>
                  <p className='mb-2 text-sm font-medium text-muted-foreground'>
                    Ghi chú hợp đồng:
                  </p>
                  <p className='text-sm leading-relaxed'>
                    {rentalContract.notes}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Tenant Information */}
        {tenant && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <User className='size-5' />
                Thông tin người thuê
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-4'>
                <div className='flex size-12 items-center justify-center rounded-full bg-primary/10'>
                  <User className='size-6 text-primary' />
                </div>
                <div>
                  <h4 className='font-semibold text-primary'>
                    {tenant.fullName}
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    @{tenant.userName}
                  </p>
                </div>
              </div>

              <div className='space-y-3'>
                {tenant.email && (
                  <div className='flex items-center gap-3 rounded-lg bg-muted/30 p-2'>
                    <Mail className='size-4 text-muted-foreground' />
                    <span className='text-sm'>{tenant.email}</span>
                  </div>
                )}

                {tenant.phone && (
                  <div className='flex items-center gap-3 rounded-lg bg-muted/30 p-2'>
                    <Phone className='size-4 text-muted-foreground' />
                    <span className='text-sm'>{tenant.phone}</span>
                  </div>
                )}

                {tenant.dob && (
                  <div className='flex items-center gap-3 rounded-lg bg-muted/30 p-2'>
                    <Calendar className='size-4 text-muted-foreground' />
                    <span className='text-sm'>
                      Sinh ngày: {dayjs(tenant.dob).format('DD/MM/YYYY')}
                    </span>
                  </div>
                )}

                {tenant.gender && (
                  <div className='flex items-center gap-3 rounded-lg bg-muted/30 p-2'>
                    <User className='size-4 text-muted-foreground' />
                    <span className='text-sm'>Giới tính: {tenant.gender}</span>
                  </div>
                )}

                {tenant.address && (
                  <div className='flex items-start gap-3 rounded-lg bg-muted/30 p-2'>
                    <MapPin className='mt-0.5 size-4 text-muted-foreground' />
                    <span className='text-sm'>{tenant.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Store className='size-5' />
              Thông tin cửa hàng
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-3'>
              <div className='flex items-center gap-3 rounded-lg bg-muted/30 p-2'>
                <MapPin className='size-4 text-muted-foreground' />
                <span className='text-sm'>
                  {storeDetail?.address || 'Chưa cung cấp'}
                </span>
              </div>

              {(storeDetail?.openingTime || storeDetail?.closingTime) && (
                <div className='flex items-center gap-3 rounded-lg bg-muted/30 p-2'>
                  <Clock className='size-4 text-muted-foreground' />
                  <span className='text-sm'>
                    {storeDetail?.openingTime && storeDetail?.closingTime
                      ? `${storeDetail.openingTime} - ${storeDetail.closingTime}`
                      : 'Giờ mở cửa chưa được cập nhật'}
                  </span>
                </div>
              )}

              {storeDetail?.latitude && storeDetail?.longitude && (
                <div className='flex items-center gap-3 rounded-lg bg-muted/30 p-2'>
                  <Navigation className='size-4 text-muted-foreground' />
                  <span className='text-sm'>
                    {storeDetail.latitude}, {storeDetail.longitude}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zone Information */}
      {storeDetail?.zone && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MapPin className='size-5' />
              Thông tin khu vực
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <h4 className='mb-2 text-lg font-semibold text-primary'>
                {storeDetail.zone.zoneName}
              </h4>
              <p className='leading-relaxed text-muted-foreground'>
                {storeDetail.zone.description}
              </p>
            </div>
            <Separator />
            {storeDetail.zone.latitude && storeDetail.zone.longitude && (
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Navigation className='size-4' />
                <span>
                  Tọa độ khu vực: {storeDetail.zone.latitude},{' '}
                  {storeDetail.zone.longitude}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Contract Document */}
      {rentalContract?.contractFileUrl && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='size-5' />
              Tài liệu hợp đồng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/30'>
              <div className='flex items-center gap-3'>
                <div className='flex size-12 items-center justify-center rounded-lg bg-primary/10'>
                  <FileText className='size-6 text-primary' />
                </div>
                <div>
                  <p className='font-medium'>Hợp đồng thuê cửa hàng.pdf</p>
                  <p className='text-sm text-muted-foreground'>
                    Hợp đồng số: {rentalContract.contractNumber}
                  </p>
                  <div className='mt-1 flex items-center gap-2 text-xs text-muted-foreground'>
                    <span>
                      Được tạo:{' '}
                      {dayjs(rentalContract.createdDate).format('DD/MM/YYYY')}
                    </span>
                    <span>•</span>
                    <span>PDF Document</span>
                  </div>
                </div>
              </div>

              <div className='flex gap-2'>
                {/* View Contract Button */}
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    rentalContract?.contractFileUrl &&
                    window.open(rentalContract.contractFileUrl, '_blank')
                  }
                  className='flex items-center gap-2'
                >
                  <FileText className='size-4' />
                  Xem hợp đồng
                </Button>

                {/* Download Button */}
                <Button
                  onClick={handleDownloadContract}
                  disabled={isPendingContract}
                  size='sm'
                  className={
                    isPendingContract ? 'cursor-not-allowed opacity-70' : ''
                  }
                >
                  {isPendingContract ? (
                    <>
                      <Loader2 className='mr-2 size-4 animate-spin' />
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <Download className='mr-2 size-4' />
                      Tải xuống
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Contract Preview Actions */}
            <div className='mt-4 flex items-center justify-center gap-4 rounded-lg bg-muted/20 p-3'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() =>
                  rentalContract.contractFileUrl &&
                  window.open(rentalContract.contractFileUrl, '_blank')
                }
                className='flex items-center gap-2 text-sm'
              >
                <FileText className='size-4' />
                Xem toàn màn hình
              </Button>

              <Separator orientation='vertical' className='h-4' />

              <Button
                variant='ghost'
                size='sm'
                onClick={() =>
                  navigator.share?.({
                    title: 'Hợp đồng thuê cửa hàng',
                    text: `Hợp đồng số: ${rentalContract.contractNumber}`,
                    url: rentalContract.contractFileUrl || '',
                  }) ||
                  window.open(
                    `mailto:?subject=Hợp đồng thuê cửa hàng&body=Xem hợp đồng tại: ${rentalContract.contractFileUrl}`,
                    '_blank'
                  )
                }
                className='flex items-center gap-2 text-sm'
              >
                <Mail className='size-4' />
                Chia sẻ
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Images Gallery */}
      {additionalImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Hình ảnh cửa hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
              {additionalImages.map((image, index) => (
                <div
                  key={image.id || index}
                  className='group relative aspect-square overflow-hidden rounded-lg bg-muted transition-all duration-300 hover:shadow-lg'
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `Hình ảnh ${index + 1}`}
                    fill
                    className='object-cover transition-transform duration-300 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20' />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmModal
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteContract}
        title='Chấm dứt hợp đồng thuê'
        description={`Bạn có chắc chắn muốn chấm dứt hợp đồng thuê cửa hàng "${storeDetail?.storeName}"? Hành động này không thể hoàn tác và sẽ kết thúc ngay lập tức mối quan hệ thuê giữa bạn và cửa hàng.`}
        confirmText='Chấm dứt hợp đồng'
        cancelText='Hủy bỏ'
        isLoading={isDeletingUserStore}
      />
    </div>
  );
};

export default StoreRentalContractPage;
