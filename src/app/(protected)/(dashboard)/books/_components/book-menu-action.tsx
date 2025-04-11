import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PATH } from '@/enums/path';
import { Book } from '@/types/book-types';
import { Edit, Eye, MoreHorizontal, Trash } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  book: Book;
  _onDelete: (id: string) => void;
};

const BookMenuAction = ({ book, _onDelete }: Props) => {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link href={`${PATH.ADMIN_BOOKS}/${book.id}`}>
            <Eye className='mr-2 h-4 w-4' />
            Xem chi tiết
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`${PATH.ADMIN_BOOKS}/${book.id}/edit`)}
          className='cursor-pointer'
        >
          <Edit className='mr-2 h-4 w-4' />
          Sửa
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => _onDelete(book.id!)}
          className='cursor-pointer text-red-600'
        >
          <Trash className='mr-2 h-4 w-4' />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BookMenuAction;
