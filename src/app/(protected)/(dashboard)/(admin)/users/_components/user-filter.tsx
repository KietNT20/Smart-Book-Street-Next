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
import { Gender } from '@/enums/gender';
import useDebounce from '@/hooks/use-debounce';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SearchFilters } from '../page';

dayjs.locale('vi');

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
                  <ChevronUp className='ml-2 size-4' />
                ) : (
                  <ChevronDown className='ml-2 size-4' />
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
                    value={filters.userName || ''}
                    onChange={(e) =>
                      handleInputChange('userName', e.target.value)
                    }
                  />
                  {filters.userName && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('userName')}
                    >
                      <X className='size-4' />
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
                    value={filters.fullName || ''}
                    onChange={(e) =>
                      handleInputChange('fullName', e.target.value)
                    }
                  />
                  {filters.fullName && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('fullName')}
                    >
                      <X className='size-4' />
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
                      <X className='size-4' />
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
                      <X className='size-4' />
                    </Button>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='dob'>Ngày sinh</Label>
                <div className='relative'>
                  <DatePicker
                    id='dob'
                    className='h-10 w-full px-3 py-2'
                    placeholder='Tìm theo ngày sinh'
                    value={filters.dob ? dayjs(filters.dob) : null}
                    onChange={(_date, dateString) =>
                      handleInputChange(
                        'dob',
                        typeof dateString === 'string' ? dateString : null
                      )
                    }
                  />
                  {filters.dob && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('phone')}
                    >
                      <X className='size-4' />
                    </Button>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='gender'>Giới tính</Label>
                <div className='relative'>
                  <Select
                    value={filters.gender || ''}
                    onValueChange={(value) =>
                      handleInputChange('gender', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn giới tính' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='All'>Tất cả</SelectItem>
                      <SelectItem value={Gender.Male}>Nam</SelectItem>
                      <SelectItem value={Gender.Female}>Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                  {filters.gender && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('gender')}
                    >
                      <X className='size-4' />
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
