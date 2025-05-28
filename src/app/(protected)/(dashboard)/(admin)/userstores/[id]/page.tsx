'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PATH } from '@/enums/path';
import { StoreRent, StoreRentLabels } from '@/enums/store-rent';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { useStoreById } from '@/hooks/use-store';
import {
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

type Props = {
  params: { id: string };
};

const StoreRentalContractPage = ({ params }: Props) => {
  const { userStoreByStore, isLoadingUserStore } = useUserStoreByStoreId(
    params.id
  );
  const { store: storeDetail, isLoading: storeLoading } = useStoreById(
    params.id
  );
  const { deleteUserStore, isDeletingUserStore } = useUserStoresMutation();

  const rentalContract = userStoreByStore?.[0];
  const store = rentalContract?.store;
  const tenant = rentalContract?.user;
  const canRent = !store?.userStores || store.userStores.length === 0;

  useEntityBreadcrumb(
    PATH.USER_STORES,
    'Hợp đồng thuê cửa hàng',
    params.id,
    store?.storeName || 'Cửa hàng'
  );

  const handleDeleteContract = () => {
    if (!rentalContract || !rentalContract.userId) return;

    deleteUserStore({
      userId: rentalContract.userId,
      storeId: params.id,
    });
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
      <div className='flex items-center justify-between'>
        <Link href={PATH.USER_STORES}>
          <Button variant='outline'>
            <ArrowLeft className='mr-2 size-4' />
            Quay về danh sách
          </Button>
        </Link>

        <div className='flex gap-2'>
          {rentalContract?.contractFileUrl && (
            <Button variant='outline'>
              <Download className='mr-2 size-4' />
              Tải hợp đồng
            </Button>
          )}
          {rentalContract && (
            <Button
              variant='destructive'
              onClick={handleDeleteContract}
              disabled={isDeletingUserStore}
            >
              <Trash2 className='mr-2 size-4' />
              {isDeletingUserStore ? 'Đang hủy...' : 'Hủy hợp đồng'}
            </Button>
          )}
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
                </div>
              </div>
              <Button>
                <Download className='mr-2 size-4' />
                Tải xuống
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
    </div>
  );
};

export default StoreRentalContractPage;
