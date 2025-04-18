import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useDebounce from '@/hooks/use-debounce';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { SearchFilters } from '../page';

type Props = {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  onSearch: () => void;
};

const ZoneFilter = ({ filters, setFilters, onSearch }: Props) => {
  const debouncedFilters = useDebounce(filters, 700);

  const handleInputChange = (
    field: keyof SearchFilters,
    value: string | undefined
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
    <div className='mb-6 space-y-2'>
      <Label htmlFor='zoneName'>Tên Khu Vực</Label>
      <div className='relative'>
        <Input
          id='zoneName'
          placeholder='Tìm theo tên khu vực'
          value={filters.zoneName || ''}
          onChange={(e) => handleInputChange('zoneName', e.target.value)}
        />
        {filters.zoneName && (
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-0 top-0 h-full'
            onClick={() => clearField('zoneName')}
          >
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  );
};
export default ZoneFilter;
