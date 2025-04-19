import { CommandItem } from '@/components/ui/command';
import { useGetAuthorById } from '@/hooks/use-author';
import { Check } from 'lucide-react';

type Props = {
  id: string;
  onDeselect: () => void;
};

const SelectedAuthor = ({ id, onDeselect }: Props) => {
  const { data: authorRes, isLoading } = useGetAuthorById(id);
  const author = authorRes?.result;

  if (isLoading) {
    return (
      <CommandItem disabled className='text-muted-foreground'>
        <span className='loading loading-spinner loading-sm mr-2' />
        Đang tải...
      </CommandItem>
    );
  }

  if (!author) return null;

  return (
    <CommandItem onSelect={onDeselect}>
      <Check className='mr-2 h-4 w-4 opacity-100' />
      {author.authorName}
    </CommandItem>
  );
};
export default SelectedAuthor;
