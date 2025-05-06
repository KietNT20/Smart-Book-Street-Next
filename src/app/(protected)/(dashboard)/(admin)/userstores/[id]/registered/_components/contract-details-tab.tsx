'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StoreRent } from '@/enums/store-rent';
import { UserStore } from '@/types/user-types';
import { Badge, Calendar, CalendarCheck, FileText } from 'lucide-react';

type ContractDetailsTabProps = {
  contract: UserStore;
  startDate: string;
  endDate: string;
  getVietnameseRentLabel: (status: StoreRent) => string;
  onDeleteClick: () => void;
};

const ContractDetailsTab = ({
  contract,
  startDate,
  endDate,
  getVietnameseRentLabel,
  onDeleteClick,
}: ContractDetailsTabProps) => {
  return (
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
                  <p className='font-medium'>{contract?.notes || 'No notes'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className='justify-end'>
        <Button variant='destructive' onClick={onDeleteClick}>
          Xóa Hợp Đồng
        </Button>
      </CardFooter>
    </Card>
  );
};
export default ContractDetailsTab;
