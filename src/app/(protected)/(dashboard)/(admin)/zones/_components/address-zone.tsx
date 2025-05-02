'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ZoneFormSchema } from '@/lib/zod';
import { Loader2, MapPin, Navigation, Search } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import Map, { Marker } from 'react-map-gl/mapbox';

interface AddressZoneProps {
  form: UseFormReturn<ZoneFormSchema>;
  disabled?: boolean;
}

const AddressZone = ({ form, disabled = false }: AddressZoneProps) => {
  const [address, setAddress] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [viewState, setViewState] = useState({
    longitude: 106.78011084793037,
    latitude: 10.84502574064812,
    zoom: 13,
  });
  const [markerPosition, setMarkerPosition] = useState({
    longitude: 106.78011084793037,
    latitude: 10.84502574064812,
  });

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

  // Initialize with form values if they exist
  useEffect(() => {
    const lat = form.getValues('latitude');
    const lng = form.getValues('longitude');

    if (lat && lng && lat !== 0 && lng !== 0) {
      setViewState((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
      setMarkerPosition({
        latitude: lat,
        longitude: lng,
      });
    }
  }, [form]);

  // Get coordinates from address
  const getCoordinates = async (address: string) => {
    if (!MAPBOX_TOKEN) {
      throw new Error('Chưa cấu hình MAPBOX_TOKEN');
    }

    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_TOKEN}&country=vn&limit=1`
    );

    if (!response.ok) {
      throw new Error('Không thể kết nối đến Mapbox API');
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return { longitude, latitude };
    }

    throw new Error('Không tìm thấy vị trí cho địa chỉ này');
  };

  // Handle address search
  const handleSearch = async (): Promise<void> => {
    if (!address) {
      setError('Vui lòng nhập địa chỉ trước khi tìm kiếm');
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const { latitude, longitude } = await getCoordinates(address);

      // Update form values
      form.setValue('latitude', latitude, { shouldValidate: true });
      form.setValue('longitude', longitude, { shouldValidate: true });

      // Update map position
      setViewState({
        latitude,
        longitude,
        zoom: 15,
      });
      setMarkerPosition({
        latitude,
        longitude,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setIsSearching(false);
    }
  };

  // Get current location
  const getCurrentLocation = (): void => {
    setIsGettingLocation(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Trình duyệt của bạn không hỗ trợ định vị');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Update form values
        form.setValue('latitude', latitude, { shouldValidate: true });
        form.setValue('longitude', longitude, { shouldValidate: true });

        // Update map position
        setViewState({
          latitude,
          longitude,
          zoom: 15,
        });
        setMarkerPosition({
          latitude,
          longitude,
        });

        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = 'Không thể lấy vị trí hiện tại';

        if (error.code === 1) {
          errorMessage = 'Bạn đã từ chối quyền truy cập vị trí';
        } else if (error.code === 2) {
          errorMessage = 'Không thể xác định vị trí';
        } else if (error.code === 3) {
          errorMessage = 'Quá thời gian yêu cầu vị trí';
        }

        setError(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Handle marker drag
  const onMarkerDragEnd = (event: unknown) => {
    const { lngLat } = event as { lngLat: { lng: number; lat: number } };
    const newLng = lngLat.lng;
    const newLat = lngLat.lat;

    setMarkerPosition({
      longitude: newLng,
      latitude: newLat,
    });

    form.setValue('longitude', newLng, { shouldValidate: true });
    form.setValue('latitude', newLat, { shouldValidate: true });
  };

  return (
    <div className='space-y-2'>
      <div className='grid grid-cols-1 gap-4'>
        <Input
          placeholder='Nhập địa chỉ khu vực'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
        <div className='flex gap-2'>
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

          <Button
            type='button'
            onClick={getCurrentLocation}
            disabled={isGettingLocation || disabled}
            variant='outline'
            size='sm'
          >
            {isGettingLocation ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Navigation className='mr-2 h-4 w-4' />
            )}
            Vị trí hiện tại
          </Button>
        </div>
        <div className='flex items-center'>
          <MapPin className='mr-1 h-4 w-4 text-muted-foreground' />
          <span className='text-xs text-muted-foreground'>
            {form.getValues('latitude') && form.getValues('longitude')
              ? `Tọa độ: ${form.getValues('latitude')}, ${form.getValues('longitude')}`
              : 'Chưa có tọa độ'}
          </span>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <Alert variant='destructive' className='py-2'>
          <AlertDescription className='text-xs'>{error}</AlertDescription>
        </Alert>
      )}

      {/* Map container */}
      <div className='mt-2 h-[250px] w-full overflow-hidden rounded-md border'>
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          style={{ width: '100%', height: '100%' }}
          mapStyle='mapbox://styles/mapbox/streets-v12'
        >
          <Marker
            longitude={markerPosition.longitude}
            latitude={markerPosition.latitude}
            draggable
            onDragEnd={onMarkerDragEnd}
            color='#FF0000'
          />
        </Map>
      </div>
      <p className='mt-1 text-xs text-muted-foreground'>
        Di chuyển ghim trên bản đồ để điều chỉnh vị trí chính xác hoặc sử dụng
        nút &quot;Vị trí hiện tại&quot;
      </p>
    </div>
  );
};

export default AddressZone;
