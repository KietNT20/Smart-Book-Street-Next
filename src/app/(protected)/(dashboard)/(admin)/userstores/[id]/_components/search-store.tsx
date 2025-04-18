'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useDebounce from '@/hooks/use-debounce';
import { useStoreSearch } from '@/hooks/use-store';
import { StoreData } from '@/types/store-types';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface Props {
  onSelectStore: (storeId: string) => void;
  value: string;
}

const StoreSearch = ({ onSelectStore, value }: Props) => {
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<{
    storeName: string;
    address: string;
    phone: string;
    email: string;
    storeTheme: string;
    type: string;
  }>({
    storeName: '',
    address: '',
    phone: '',
    email: '',
    storeTheme: '',
    type: '',
  });

  const debounceSearchParams = useDebounce(searchParams, 500);

  const { stores, isLoading, isPending } = useStoreSearch(debounceSearchParams);
  const isWorking = isLoading || isPending;

  const handleSearch = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleSelectStore = (selectedStore: StoreData) => {
    if (selectedStore.id) {
      onSelectStore(selectedStore.id);
      setOpen(false);
    }
  };

  return (
    <div className='flex flex-col space-y-2'>
      <div className='flex items-center space-x-2'>
        <Input
          value={value}
          disabled
          placeholder='ID cửa hàng'
          className='hidden flex-1'
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant='outline' size='icon' type='button'>
              <Search className='h-4 w-4' />
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[600px]'>
            <DialogHeader>
              <DialogTitle>Tìm kiếm cửa hàng</DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>Tên cửa hàng</Label>
                  <Input
                    placeholder='Tên cửa hàng'
                    value={searchParams.storeName}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        storeName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Địa chỉ</Label>
                  <Input
                    placeholder='Địa chỉ'
                    value={searchParams.address}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Số điện thoại</Label>
                  <Input
                    placeholder='Số điện thoại'
                    value={searchParams.phone}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    placeholder='Email'
                    value={searchParams.email}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Chủ đề cửa hàng</Label>
                  <Input
                    placeholder='Chủ đề'
                    value={searchParams.storeTheme}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        storeTheme: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Loại</Label>
                  <Input
                    placeholder='Loại cửa hàng'
                    value={searchParams.type}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        type: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <Button type='button' className='w-full' onClick={handleSearch}>
                {isWorking ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
              </Button>
            </div>

            <div className='mt-3 h-36 overflow-y-auto'>
              {isWorking ? (
                <p className='py-4 text-center'>Đang tải...</p>
              ) : stores && stores.length > 0 ? (
                stores.map((store) => (
                  <Card
                    key={store.id}
                    className='mb-2 cursor-pointer transition-colors duration-200 hover:bg-zinc-100'
                    onClick={() => handleSelectStore(store)}
                  >
                    <CardContent className='p-4'>
                      <div className='font-medium'>Tên: {store.storeName}</div>
                      <div className='text-sm text-muted-foreground'>
                        Địa chỉ: {store.address}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        Số điện thoại: {store.phone} | Email: {store.email}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className='mb-2 cursor-pointer transition-colors duration-200 hover:bg-zinc-100'>
                  <CardContent className='p-4'>
                    <p className='py-4 text-center'>
                      Không tìm thấy cửa hàng nào
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StoreSearch;
