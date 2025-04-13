import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useDebounce from '@/hooks/use-debounce';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SearchFilters } from '../page';

type Props = {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  isSearching: boolean;
  onSearch: () => void;
  onClearSearch: () => void;
};

const UserFilter = ({
  filters,
  setFilters,
  isSearching,
  onSearch,
  onClearSearch,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  const debouncedFilters = useDebounce(localFilters, 3000);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    setFilters(debouncedFilters);
    const hasActiveFilter = Object.values(debouncedFilters).some(
      (val) => val && val.trim() !== ''
    );

    if (hasActiveFilter) {
      onSearch();
    } else if (isSearching) {
      onClearSearch();
    }
  }, [debouncedFilters, setFilters, onSearch, onClearSearch, isSearching]);

  const handleInputChange = (
    field: keyof SearchFilters,
    value: string | null
  ) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
  };

  const clearField = (field: keyof SearchFilters) => {
    handleInputChange(field, '');
  };

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
                {isOpen ? (
                  <>
                    <span className='mr-1'>Ẩn bộ lọc</span>
                    <ChevronUp className='h-4 w-4' />
                  </>
                ) : (
                  <>
                    <span className='mr-1'>Hiển thị bộ lọc</span>
                    <ChevronDown className='h-4 w-4' />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <div className='grid grid-cols-1 gap-4 pt-2 md:grid-cols-2 lg:grid-cols-3'>
              <div className='space-y-2'>
                <Label htmlFor='userName'>Tài khoản</Label>
                <div className='relative'>
                  <Input
                    id='userName'
                    placeholder='Tìm theo tên tài khoản'
                    value={localFilters.userName || ''}
                    onChange={(e) =>
                      handleInputChange('userName', e.target.value)
                    }
                  />
                  {localFilters.userName && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('userName')}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='fullName'>Tên người dùng</Label>
                <div className='relative'>
                  <Input
                    id='fullName'
                    placeholder='Tìm theo tên người dùng'
                    value={localFilters.fullName || ''}
                    onChange={(e) =>
                      handleInputChange('fullName', e.target.value)
                    }
                  />
                  {localFilters.fullName && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('fullName')}
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
                    value={localFilters.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  {localFilters.email && (
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
                <Label htmlFor='phone'>Số điện thoại</Label>
                <div className='relative'>
                  <Input
                    id='phone'
                    placeholder='Tìm theo số điện thoại'
                    value={localFilters.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                  {localFilters.phone && (
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
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default UserFilter;
