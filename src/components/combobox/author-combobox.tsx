'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useSearchAuthorName } from '@/hooks/use-author';
import useDebounce from '@/hooks/use-debounce';
import { cn, formateDateVi } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import SelectedAuthor from './selected-author';

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  description?: string;
};

const AuthorCombobox = <T extends FieldValues>({
  name,
  control,
  description,
}: Props<T>) => {
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 300);

  const { authors, authorsLoading } = useSearchAuthorName(debouncedInput);

  const handleSearch = (value: string) => {
    setInput(value);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Convert field.value to array if it's undefined
        const selectedAuthors = (field.value as string[]) || [];

        return (
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
                      !selectedAuthors.length && 'text-muted-foreground'
                    )}
                  >
                    {selectedAuthors.length > 0
                      ? authors
                          .filter((author) =>
                            selectedAuthors.includes(author.id)
                          )
                          .map((author) => author.authorName)
                          .join(', ')
                      : description
                        ? description
                        : 'Chọn tác giả...'}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                align='start'
                className='max-w-56 p-0 lg:max-w-lg'
              >
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder='Tìm tác giả...'
                    value={input}
                    onValueChange={handleSearch}
                  />
                  <CommandList>
                    {selectedAuthors.length > 0 && !input && (
                      <>
                        <CommandGroup heading='Thay đổi tác giả'>
                          {selectedAuthors.map((id: string) => (
                            <SelectedAuthor
                              key={id}
                              id={id}
                              onDeselect={() => {
                                field.onChange(
                                  selectedAuthors.filter(
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

                    <CommandGroup>
                      {authorsLoading && (
                        <CommandItem disabled className='text-muted-foreground'>
                          <span className='loading loading-spinner loading-sm mr-2' />
                          Đang tải...
                        </CommandItem>
                      )}
                      {!authorsLoading &&
                        !authors?.length &&
                        debouncedInput && (
                          <CommandEmpty>Không tìm thấy tác giả.</CommandEmpty>
                        )}
                      {!authorsLoading &&
                        authors?.map((author) => {
                          const isSelected = selectedAuthors.includes(
                            author.id
                          );

                          return (
                            <CommandItem
                              key={author.id}
                              onSelect={() => {
                                field.onChange(
                                  isSelected
                                    ? selectedAuthors.filter(
                                        (id) => id !== author.id
                                      )
                                    : [...selectedAuthors, author.id]
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  isSelected ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              {author.authorName} ({formateDateVi(author.dob)})
                            </CommandItem>
                          );
                        })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormDescription>
              Tác giả được chọn:{' '}
              {selectedAuthors.length > 0
                ? authors
                    .filter((author) => selectedAuthors.includes(author.id))
                    .map((author) => author.authorName)
                    .join(', ')
                : description
                  ? description
                  : 'Chọn tác giả'}
            </FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default AuthorCombobox;
