import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import useDebounce from '@/hooks/use-debounce';
import { DatePicker } from 'antd';
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

const EventFilter = ({
  filters,
  setFilters,
  isSearching,
  onSearch,
  onClearSearch,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const debouncedFilters = useDebounce(filters, 700);

  const handleInputChange = (field: keyof SearchFilters, value: unknown) => {
    console.log('Value:', value);
    setFilters({ ...filters, [field]: value });
  };

  const clearField = (field: keyof SearchFilters) => {
    if (field === 'allowAds') {
      setFilters({ ...filters, [field]: false });
    } else if (field === 'startDate' || field === 'endDate') {
      setFilters({ ...filters, [field]: null });
    } else {
      setFilters({ ...filters, [field]: '' });
    }
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
                Bộ lọc{' '}
                {isOpen ? (
                  <ChevronUp className='ml-2 h-4 w-4' />
                ) : (
                  <ChevronDown className='ml-2 h-4 w-4' />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <div className='grid grid-cols-1 gap-4 pt-2 md:grid-cols-2 lg:grid-cols-4'>
              <div className='space-y-2'>
                <Label htmlFor='key'>Tên sự kiện</Label>
                <div className='relative'>
                  <Input
                    id='key'
                    placeholder='Tìm theo tên sự kiện'
                    value={filters.key || ''}
                    onChange={(e) => handleInputChange('key', e.target.value)}
                  />
                  {filters.key && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('key')}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='allowAds'>Có quảng cáo</Label>
                <div className='flex h-10 items-center space-x-2'>
                  <Switch
                    id='allowAds'
                    checked={filters.allowAds}
                    onCheckedChange={(checked) =>
                      handleInputChange('allowAds', checked)
                    }
                  />
                  <span className='text-sm text-muted-foreground'>
                    {filters.allowAds ? 'Có' : 'Không'}
                  </span>
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='startDate'>Ngày bắt đầu</Label>
                <div className='relative'>
                  <DatePicker
                    id='startDate'
                    value={
                      filters.startDate
                        ? new Date(filters.startDate as string)
                        : null
                    }
                    onChange={(date) =>
                      handleInputChange(
                        'startDate',
                        date ? date.toISOString().split('T')[0] : null
                      )
                    }
                    format='YYYY-MM-DD'
                    className='h-10 w-full px-3 py-2'
                  />
                  {filters.startDate && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('startDate')}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='endDate'>Ngày kết thúc</Label>
                <div className='relative'>
                  <DatePicker
                    id='endDate'
                    value={
                      filters.endDate
                        ? new Date(filters.endDate as string)
                        : null
                    }
                    onChange={(date) =>
                      handleInputChange(
                        'endDate',
                        date ? date.toISOString().split('T')[0] : null
                      )
                    }
                    format='YYYY-MM-DD'
                    className='h-10 w-full px-3 py-2'
                  />
                  {filters.endDate && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('endDate')}
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

export default EventFilter;
