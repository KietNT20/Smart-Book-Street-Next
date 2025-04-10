import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import useDebounce from '@/hooks/use-debounce';
import { usePublisherMutation } from '@/hooks/use-publisher';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';

type Publisher = {
  id: string;
  publisherName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
};

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
};

const PublisherCombobox = <T extends FieldValues>({
  name,
  control,
}: Props<T>) => {
  const [searchInputs, setSearchInputs] = useState({
    publisherName: '',
    email: '',
    phone: '',
  });
  const [results, setResults] = useState<Publisher[]>([]);
  const [open, setOpen] = useState(false);
  const [publisherInfo, setPublisherInfo] = useState<Publisher | null>(null);

  const { searchPublisher } = usePublisherMutation();
  const debouncedResults = useDebounce(results, 300);

  const handleSearch = async (
    field: keyof typeof searchInputs,
    value: string
  ) => {
    const newSearchInputs = { ...searchInputs, [field]: value };
    setSearchInputs(newSearchInputs);

    // Only search if at least one field has a value
    if (!Object.values(newSearchInputs).some((val) => val)) {
      setResults([]);
      return;
    }

    try {
      const { results } = await searchPublisher.mutateAsync(newSearchInputs);
      setResults(results);
    } catch (error) {
      console.error('Failed to search publisher:', error);
      setResults([]);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Nhà xuất bản <span className='text-red-400'>*</span>
          </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  role='combobox'
                  className='w-full justify-between'
                >
                  {publisherInfo ? (
                    <span className='flex items-center gap-2'>
                      <span>{publisherInfo.publisherName}</span>
                      <span className='text-sm text-muted-foreground'>
                        ({publisherInfo.email} - {publisherInfo.phone})
                      </span>
                    </span>
                  ) : (
                    'Chọn nhà xuất bản...'
                  )}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              align='start'
              className='w-[200px] p-0 lg:w-[400px]'
            >
              <Command shouldFilter={false}>
                <div className='space-y-2 border-b border-gray-200 p-2'>
                  <CommandInput
                    placeholder='Tên nhà xuất bản...'
                    value={searchInputs.publisherName}
                    onValueChange={(value) =>
                      handleSearch('publisherName', value)
                    }
                  />
                  <div className='flex gap-2'>
                    <Input
                      placeholder='Email...'
                      value={searchInputs.email}
                      onChange={(e) => handleSearch('email', e.target.value)}
                      className='h-8'
                    />
                    <Input
                      placeholder='Số điện thoại...'
                      value={searchInputs.phone}
                      onChange={(e) => handleSearch('phone', e.target.value)}
                      className='h-8'
                    />
                  </div>
                </div>
                <CommandList>
                  <CommandGroup className='max-h-80 overflow-y-auto'>
                    {searchPublisher.isPending && (
                      <CommandItem disabled className='text-muted-foreground'>
                        <span className='loading loading-spinner loading-sm mr-2' />
                        Đang tải...
                      </CommandItem>
                    )}
                    {!searchPublisher.isPending &&
                      !debouncedResults?.length &&
                      Object.values(searchInputs).some((val) => val) && (
                        <CommandEmpty>
                          Không tìm thấy nhà xuất bản.
                        </CommandEmpty>
                      )}
                    {!searchPublisher.isPending &&
                      debouncedResults?.map((publisher) => (
                        <CommandItem
                          key={publisher.id}
                          onSelect={() => {
                            field.onChange(publisher.id);
                            setPublisherInfo(publisher);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value?.id === publisher.id
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          <div className='flex flex-col'>
                            <span className='font-medium'>
                              {publisher.publisherName}
                            </span>
                            <div className='text-sm text-muted-foreground'>
                              <span>{publisher.email}</span>
                              {publisher.phone && (
                                <>
                                  <span className='mx-1'>•</span>
                                  <span>{publisher.phone}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PublisherCombobox;
