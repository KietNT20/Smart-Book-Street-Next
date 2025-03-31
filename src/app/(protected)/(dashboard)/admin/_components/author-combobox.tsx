import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useAuthorMutation } from '@/hooks/use-author';
import useDebounce from '@/hooks/useDebounce';
import { cn, formateDateVi } from '@/lib/utils';
import { Author } from '@/types/author-types';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import SelectedAuthor from './selected-author';

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
};

const AuthorCombobox = <T extends FieldValues>({ name, control }: Props<T>) => {
  const [input, setInput] = useState('');
  const [searchResults, setSearchResults] = useState<Author[]>([]);
  const { searchAuthorName } = useAuthorMutation();

  const debouncedResults = useDebounce(searchResults, 300);

  const handleSearch = (value: string) => {
    setInput(value);

    if (!value) {
      setSearchResults([]);
      return;
    }

    searchAuthorName.mutate(
      {
        authorName: value
      },
      {
        onSuccess: (data) => {
          setSearchResults(data.results || []);
        },
        onError: (error) => {
          console.error('Failed to search author:', error);
          setSearchResults([]);
        }
      }
    );
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Tác giả <span className='text-red-400'>*</span>
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  role='combobox'
                  className={cn(
                    'w-full justify-between',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value?.length
                    ? `${field.value?.length} tác giả được chọn`
                    : 'Chọn tác giả...'}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              align='start'
              className='w-[200px] p-0 lg:w-[500px]'
            >
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder='Tìm tác giả...'
                  value={input}
                  onValueChange={handleSearch}
                />
                <CommandList>
                  {field.value?.length > 0 && !input && (
                    <>
                      <CommandGroup heading='Đã chọn'>
                        {field.value.map((id: string) => (
                          <SelectedAuthor
                            key={id}
                            id={id}
                            onDeselect={() => {
                              field.onChange(
                                field.value.filter(
                                  (authorId: string) => authorId !== id
                                )
                              );
                            }}
                          />
                        ))}
                      </CommandGroup>
                      <CommandSeparator />
                    </>
                  )}

                  <CommandGroup className='max-h-80 overflow-y-auto'>
                    {searchAuthorName.isPending && (
                      <CommandItem disabled className='text-muted-foreground'>
                        <span className='loading loading-spinner loading-sm mr-2' />
                        Đang tải...
                      </CommandItem>
                    )}
                    {!searchAuthorName.isPending &&
                      !debouncedResults?.length &&
                      input && (
                        <CommandEmpty>Không tìm thấy tác giả.</CommandEmpty>
                      )}
                    {!searchAuthorName.isPending &&
                      debouncedResults?.map((author) => (
                        <CommandItem
                          key={author.id}
                          onSelect={() => {
                            const values = (field.value as string[]) || [];
                            field.onChange(
                              values?.includes(author.id)
                                ? values?.filter(
                                    (id: string) => id !== author.id
                                  )
                                : [...values, author.id]
                            );
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              (field.value as string[])?.includes(author.id)
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {author.authorName} (
                          {author.dob ? formateDateVi(author.dob) : ''})
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

export default AuthorCombobox;
