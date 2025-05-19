'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useDebounce from '@/hooks/use-debounce';
import { useZonesByStreet } from '@/hooks/use-zone';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SearchFilters } from '../page';

interface StoreFilterProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  isSearching: boolean;
  onSearch: () => void;
  onClearSearch: () => void;
}

const StoreFilter = ({
  filters,
  setFilters,
  isSearching,
  onSearch,
  onClearSearch,
}: StoreFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { zonesByStreetRes } = useZonesByStreet();

  const debouncedFilters = useDebounce(filters, 700);

  const handleInputChange = (
    field: keyof SearchFilters,
    value: string | null
  ) => {
    setFilters({ ...filters, [field]: value });
  };

  const clearField = (field: keyof SearchFilters) => {
    setFilters({ ...filters, [field]: '' });
  };

  useEffect(() => {
    onSearch();
  }, [debouncedFilters, onSearch]);

  return (
    <Card className='mb-6'>
      <CardContent className='p-3 pt-3'>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className='flex items-center justify-end gap-2'>
            {isSearching && (
              <Button variant='outline' onClick={onClearSearch} size='sm'>
                Xóa bộ lọc
              </Button>
            )}
            <CollapsibleTrigger asChild>
              <Button variant='outline' size='sm'>
                <Filter /> Bộ lọc{' '}
                {isOpen ? (
                  <ChevronUp className='ml-2 h-4 w-4' />
                ) : (
                  <ChevronDown className='ml-2 h-4 w-4' />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <div className='grid grid-cols-1 gap-4 pt-2 md:grid-cols-2 lg:grid-cols-3'>
              <div className='space-y-2'>
                <Label htmlFor='storeName'>Tên cửa hàng</Label>
                <div className='relative'>
                  <Input
                    id='storeName'
                    placeholder='Tìm theo tên cửa hàng'
                    value={filters.storeName || ''}
                    onChange={(e) =>
                      handleInputChange('storeName', e.target.value)
                    }
                  />
                  {filters.storeName && (
                    <Button
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('storeName')}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='address'>Địa chỉ</Label>
                <div className='relative'>
                  <Input
                    id='address'
                    placeholder='Tìm theo địa chỉ'
                    value={filters.address || ''}
                    onChange={(e) =>
                      handleInputChange('address', e.target.value)
                    }
                  />
                  {filters.address && (
                    <Button
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('address')}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='zoneId'>Khu vực</Label>
                <div className='relative'>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange('zoneId', value)
                    }
                    value={filters.zoneId}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Chọn khu vực' />
                    </SelectTrigger>
                    <SelectContent>
                      {zonesByStreetRes?.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id}>
                          {zone.zoneName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {filters.zoneId && (
                    <Button
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('zoneId')}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='storeTheme'>Chủ đề của cửa hàng</Label>
                <div className='relative'>
                  <Input
                    id='storeTheme'
                    placeholder='Tìm theo chủ đề cửa hàng'
                    value={filters.storeTheme || ''}
                    onChange={(e) =>
                      handleInputChange('storeTheme', e.target.value)
                    }
                  />
                  {filters.storeTheme && (
                    <Button
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('storeTheme')}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='type'>Loại cửa hàng</Label>
                <div className='relative'>
                  <Input
                    id='type'
                    placeholder='Tìm theo loại cửa hàng'
                    value={filters.type || ''}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  />
                  {filters.type && (
                    <Button
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('type')}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default StoreFilter;
