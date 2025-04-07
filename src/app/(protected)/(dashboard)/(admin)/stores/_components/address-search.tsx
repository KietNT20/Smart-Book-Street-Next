'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { StoreFormValues } from '@/lib/zod';
import { Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface AddressSearchProps {
  form: UseFormReturn<StoreFormValues>;
  disabled?: boolean;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const getCoordinates = async (address: string): Promise<Coordinates> => {
  const encodedAddress = encodeURIComponent(address);
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_TOKEN}&country=vn&limit=1`
  );

  if (!response.ok) {
    throw new Error('Không thể kết nối với Mapbox API');
  }

  const data = await response.json();

  if (data.features && data.features.length > 0) {
    const [longitude, latitude] = data.features[0].center;
    return { longitude, latitude };
  }

  throw new Error('Không tìm thấy vị trí cho địa chỉ này');
};

const AddressSearch = ({ form, disabled = false }: AddressSearchProps) => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSearch = async (): Promise<void> => {
    const address = form.getValues('address');

    if (!address) {
      setError('Vui lòng nhập địa chỉ trước khi tìm kiếm');
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const { latitude, longitude } = await getCoordinates(address);

      // Set the latitude and longitude values in the form
      form.setValue('latitude', latitude, { shouldValidate: true });
      form.setValue('longitude', longitude, { shouldValidate: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2'>
        <Button
          type='button'
          onClick={handleSearch}
          disabled={isSearching || disabled}
          variant='outline'
          size='sm'
        >
          {isSearching ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <Search className='mr-2 h-4 w-4' />
          )}
          Tìm tọa độ
        </Button>
        {form.getValues('latitude') && form.getValues('longitude') && (
          <span className='text-xs text-muted-foreground'>
            Đã tìm thấy tọa độ
          </span>
        )}
      </div>

      {error && (
        <Alert variant='destructive' className='py-2'>
          <AlertDescription className='text-xs'>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AddressSearch;
