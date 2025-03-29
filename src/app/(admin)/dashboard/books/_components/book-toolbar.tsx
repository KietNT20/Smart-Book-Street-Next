import { Button } from '@/components/ui/button';
import { PATH } from '@/enums/path';
import { Plus, Search, X } from 'lucide-react';
import Link from 'next/link';

interface BookToolbarProps {
  hasFilters: boolean;
  onResetFilters: () => void;
  onOpenSearch: () => void;
}

export function BookToolbar({
  hasFilters,
  onResetFilters,
  onOpenSearch
}: BookToolbarProps) {
  return (
    <div className='flex items-center justify-between'>
      <h2 className='text-2xl font-bold'>Quản lý sách</h2>
      <div className='flex items-center gap-2'>
        {hasFilters && (
          <Button variant='outline' onClick={onResetFilters} className='gap-2'>
            <X className='h-4 w-4' />
            Đặt lại bộ lọc
          </Button>
        )}
        <Button variant='outline' onClick={onOpenSearch}>
          <Search className='mr-2 h-4 w-4' />
          Tìm kiếm
        </Button>
        <Link href={`${PATH.BOOKS}/create`}>
          <Button>
            <Plus className='mr-2 h-4 w-4' /> Thêm sách mới
          </Button>
        </Link>
      </div>
    </div>
  );
}
