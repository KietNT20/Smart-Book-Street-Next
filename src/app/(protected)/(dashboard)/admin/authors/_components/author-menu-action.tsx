import { ConfirmModal } from '@/components/confirm-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { PATH } from '@/enums/path';
import { useAuthorMutation } from '@/hooks/use-author';
import { Author } from '@/types/author-types';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  author: Author;
};

const AuthorMenuAction = ({ author }: Props) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const router = useRouter();
  const { deleteAuthor } = useAuthorMutation();

  const _onDelete = async (id: string) => {
    try {
      await deleteAuthor.mutateAsync(id, {
        onSuccess: () => {
          toast.success('Xóa tác giả thành công');
          setIsDeleteModalOpen(false);
        },
        onError: () => {
          toast.error('Đã xảy ra lỗi khi xóa tác giả');
          setIsDeleteModalOpen(false);
        }
      });
    } catch (error) {
      console.error(error);
      setIsDeleteModalOpen(false);
    }
  };

  const handleModalClose = () => {
    setIsDeleteModalOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Mở menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem asChild className='cursor-pointer'>
            <Link href={`${PATH.ADMIN_AUTHORS}/${author.id}`}>
              <Eye className='mr-2 h-4 w-4' />
              Xem chi tiết
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push(`${PATH.ADMIN_AUTHORS}/${author.id}/edit`);
            }}
            className='cursor-pointer'
          >
            <Pencil className='mr-2 h-4 w-4' />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsDeleteModalOpen(true);
              setIsDropdownOpen(false);
            }}
            className='cursor-pointer text-red-600'
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleModalClose}
        onConfirm={() => _onDelete(author.id)}
        title='Xóa sách'
        description='Bạn có chắc chắn muốn xóa sách này? Hành động này không thể hoàn tác.'
        confirmText='Xóa'
        cancelText='Hủy'
        variant='destructive'
        isLoading={deleteAuthor.isPending}
      />
    </>
  );
};

export default AuthorMenuAction;
