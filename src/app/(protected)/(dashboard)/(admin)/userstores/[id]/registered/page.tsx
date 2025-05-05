'use client';

import { AlertDestructive } from '@/components/alert/alert-destructive';
import BackButton from '@/components/back-btn/back-button';
import { Badge as UIBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { formateDateVi } from '@/lib/utils';
import { getVietnameseRentLabel } from '@/utils/format';
import {
  Badge,
  Calendar,
  CalendarCheck,
  FileText,
  Mail,
  MapPin,
  Phone,
  Store,
  User,
} from 'lucide-react';
import LoadingSkeleton from './_components/loading-skeleton';
import { useUserStoreRegistered } from './_hooks/use-userstore-registered';

type Props = {
  params: { id: string };
};

const UserStoreRegisteredPage = ({ params }: Props) => {
  const userId = params.id as string;
  const {
    userStore,
    isLoading,
    error,
    contract,
    store,
    user,
    startDate,
    endDate,
    getStatusColor,
    selectedContractIndex,
    setSelectedContractIndex,
    handleDeleteUserStore,
    router,
  } = useUserStoreRegistered({ userId });
  useEntityBreadcrumb(
    PATH.USER_STORES,
    'Cửa hàng của người dùng',
    userId,
    user?.fullName
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !contract || !store) {
    router.replace(PATH.USER_STORES);
    return (
      <div>
        <BackButton routeTo={PATH.USER_STORES} />
        <div className='flex min-h-screen flex-col items-center justify-center'>
          <AlertDestructive
            title='Có lỗi xảy ra!'
            description='Không thể lấy thông tin hợp đồng. Hoặc hợp đồng không tồn tại.'
          />
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto'>
      <div className='mb-6 space-y-2'>
        <BackButton routeTo={PATH.USER_STORES} />
        <h1 className='text-3xl font-bold'>Thông Tin Hợp Đồng</h1>
        <div className='flex items-center gap-6'>
          <p className='text-muted-foreground'>#{contract?.contractNumber}</p>
          <UIBadge
            className={`px-3 py-1 text-sm ${getStatusColor(contract?.status)}`}
          >
            {getVietnameseRentLabel(contract?.status)}
          </UIBadge>
        </div>
      </div>

      {userStore.length > 1 && (
        <div className='mb-6'>
          <h2 className='mb-2 text-lg font-medium'>Chọn hợp đồng:</h2>
          <div className='flex flex-wrap gap-2'>
            {userStore.map((contract, index) => (
              <Button
                key={contract?.contractNumber}
                variant={
                  selectedContractIndex === index ? 'default' : 'outline'
                }
                onClick={() => setSelectedContractIndex(index)}
                className='flex items-center gap-2'
              >
                <span>#{contract?.contractNumber}</span>
                <UIBadge
                  className={`px-2 py-0.5 text-xs ${getStatusColor(
                    contract?.status
                  )}`}
                >
                  {getVietnameseRentLabel(contract?.status)}
                </UIBadge>
              </Button>
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue='details' className='w-full'>
        <TabsList>
          <TabsTrigger value='details'>Tình trạng hợp đồng</TabsTrigger>
          <TabsTrigger value='store'>Thông Tin Cửa Hàng</TabsTrigger>
          <TabsTrigger value='user'>Thông Tin Người Thuê</TabsTrigger>
        </TabsList>

        <TabsContent value='details' className='mt-4'>
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Hợp Đồng</CardTitle>
              <CardDescription>
                Thông tin chi tiết về hợp đồng giữa người thuê và cửa hàng
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <FileText className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>
                        Số Hợp Đồng
                      </p>
                      <p className='font-medium'>{contract?.contractNumber}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <CalendarCheck className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>
                        Ngày Bắt Đầu
                      </p>
                      <p className='font-medium'>{startDate}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Calendar className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>
                        Ngày Kết Thúc
                      </p>
                      <p className='font-medium'>{endDate}</p>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <Badge className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>
                        Tình Trạng
                      </p>
                      <p className='font-medium'>
                        {getVietnameseRentLabel(contract?.status)}
                      </p>
                    </div>
                  </div>

                  {contract?.notes && (
                    <div className='flex items-start gap-2'>
                      <FileText className='h-5 w-5 text-muted-foreground' />
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>
                          Ghi Chú
                        </p>
                        <p className='font-medium'>
                          {contract?.notes || 'No notes'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className='justify-end'>
              <Button
                variant='destructive'
                onClick={() =>
                  handleDeleteUserStore(contract?.userId, contract?.storeId)
                }
              >
                Xóa
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='store' className='mt-4'>
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Cửa Hàng</CardTitle>
              <CardDescription>
                Thông tin về cửa hàng trong hợp đồng này
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <Store className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>
                        Tên Cửa Hàng
                      </p>
                      <p className='font-medium'>{store?.storeName}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <MapPin className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>
                        Địa Chỉ
                      </p>
                      <p className='font-medium'>{store?.address}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Phone className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>
                        Số Điện Thoại
                      </p>
                      <p className='font-medium'>{store?.phone}</p>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <Mail className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>
                        Email
                      </p>
                      <p className='font-medium'>{store?.email}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Store className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>
                        Loại Cửa Hàng
                      </p>
                      <p className='font-medium'>{store?.type}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <MapPin className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>
                        Tọa độ
                      </p>
                      <p className='font-medium'>
                        Vĩ độ: {store?.latitude}, Kinh độ: {store?.longitude}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className='justify-end'>
              <Button
                variant='outline'
                onClick={() => router.push(`${PATH.STORES}/${store?.id}`)}
              >
                Xem Chi Tiết Cửa Hàng
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='user' className='mt-4'>
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Người Thuê</CardTitle>
              <CardDescription>
                Thông tin về người thuê trong hợp đồng này
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <User className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>
                        Tên Đăng Nhập
                      </p>
                      <p className='font-medium'>{user?.userName}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <User className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>
                        Họ và Tên
                      </p>
                      <p className='font-medium'>{user?.fullName}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Mail className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>
                        Email
                      </p>
                      <p className='font-medium'>{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>
                        Ngày Sinh
                      </p>
                      <p className='font-medium'>
                        {formateDateVi(user?.dob || null)}
                      </p>
                    </div>
                  </div>

                  {user?.phone && (
                    <div className='flex items-center gap-2'>
                      <Phone className='h-5 w-5 text-muted-foreground' />
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>
                          Số Điện Thoại
                        </p>
                        <p className='font-medium'>
                          {user?.phone || 'Không cung cấp'}
                        </p>
                      </div>
                    </div>
                  )}

                  {user?.address && (
                    <div className='flex items-center gap-2'>
                      <MapPin className='h-5 w-5 text-muted-foreground' />
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>
                          Địa Chỉ
                        </p>
                        <p className='font-medium'>
                          {user?.address || 'Không cung cấp'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className='justify-end'>
              <Button variant='outline'>Xem Hồ Sơ Người Dùng</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserStoreRegisteredPage;
