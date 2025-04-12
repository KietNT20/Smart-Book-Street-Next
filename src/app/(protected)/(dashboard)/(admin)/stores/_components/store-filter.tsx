import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';
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

  const handleInputChange = (
    field: keyof SearchFilters,
    value: string | null
  ) => {
    setFilters({ ...filters, [field]: value });
  };

  const clearField = (field: keyof SearchFilters) => {
    setFilters({ ...filters, [field]: null });
  };

  return (
    <Card className='mb-6'>
      <CardContent className='pt-6'>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className='flex items-center justify-end gap-2'>
            {isSearching && (
              <Button variant='outline' onClick={onClearSearch} size='sm'>
                Xóa bộ lọc
              </Button>
            )}
            <Button onClick={onSearch} size='sm'>
              Tìm kiếm
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant='outline' size='sm'>
                {isOpen ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
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
                      variant='ghost'
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
                      variant='ghost'
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
                <Label htmlFor='phone'>Số điện thoại</Label>
                <div className='relative'>
                  <Input
                    id='phone'
                    placeholder='Tìm theo số điện thoại'
                    value={filters.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                  {filters.phone && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('phone')}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <div className='relative'>
                  <Input
                    id='email'
                    placeholder='Tìm theo email'
                    value={filters.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  {filters.email && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('email')}
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
                      variant='ghost'
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
                      variant='ghost'
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
