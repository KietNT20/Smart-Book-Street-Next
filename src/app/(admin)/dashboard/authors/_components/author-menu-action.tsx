import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PATH } from '@/enums/path';
import { Author } from '@/types/author-types';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  author: Author;
};

const AuthorMenuAction = ({ author }: Props) => {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Mở menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link href={`${PATH.AUTHORS}/${author.id}`}>
            <Eye className='mr-2 h-4 w-4' />
            Xem chi tiết
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            router.push(`${PATH.AUTHORS}/${author.id}/edit`);
          }}
          className='cursor-pointer'
        >
          <Pencil className='mr-2 h-4 w-4' />
          Chỉnh sửa
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            console.log('Delete author:', author.id);
          }}
          className='cursor-pointer text-red-600'
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthorMenuAction;
