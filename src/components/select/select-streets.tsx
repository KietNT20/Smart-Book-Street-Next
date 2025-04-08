'use client';

import { useStreets } from '@/hooks/use-street';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { Skeleton } from '../ui/skeleton';

const SelectStreet = () => {
  const { streetsRes, isLoadingStreets, errorStreets } = useStreets();
  return (
    <Select>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Lựa chọn đường sách' />
      </SelectTrigger>
      <SelectContent>
        {isLoadingStreets && <Skeleton className='h-8 w-full' />}
        {errorStreets && (
          <SelectItem value=''>Có lỗi xảy ra, vui lòng thử lại</SelectItem>
        )}
        {streetsRes.length !== 0 &&
          streetsRes.map((street) => (
            <SelectItem key={street.id} value={street.id}>
              {street.streetName} - {street.address}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default SelectStreet;
