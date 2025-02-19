'use client';
import BackButton from '@/components/back-btn/back-button';
import { ConfirmModal } from '@/components/confirm-modal';
import ImageUploader from '@/components/image-upload/image-uploader';
import SpinLoading from '@/components/spin/spin-loading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PATH } from '@/enums/path';
import { useBookSearchById } from '@/hooks/use-book-search';
import { useBookMutations } from '@/hooks/use-books';
import { useGetImageByTypeOrEntityID } from '@/hooks/use-images';
import useDebounce from '@/hooks/useDebounce';
import { formatDate, formatPrice } from '@/lib/utils';
import { authorService } from '@/services/authorService';
import { categoryService } from '@/services/categoryService';
import { ImageResArr } from '@/types/image-types';
import { useQueries } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BookAuthorIds, BookCategoryIds } from '../_components/book-form';
import ImageCard from './_components/image-card';

export default function BooksDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  const { data: bookDetailData, isLoading: bookDetailLoading } =
    useBookSearchById(params.id);
  const { data: imageUrlBook, isLoading: getImagePending } =
    useGetImageByTypeOrEntityID({
      entityId: params.id,
    });
  const { deleteBookMutation } = useBookMutations();
  const apiLoading = useDebounce(bookDetailLoading || getImagePending, 300);
  const deletedLoading = useDebounce(deleteBookMutation.isPending, 300);
  const book = bookDetailData?.result;
  const bookAuthorsRes = useQueries({
    queries: ((book?.bookAuthors as BookAuthorIds[]) || [])?.map(
      (bookAuth, index: number) => ({
        queryKey: ['author', index],
        queryFn: () => authorService.getById(bookAuth.authorId),
      })
    ),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  const bookCategoriesRes = useQueries({
    queries: ((book?.bookCategories as BookCategoryIds[]) || [])?.map(
      (bookCategory, index: number) => ({
        queryKey: ['category', index],
        queryFn: () => categoryService.getById(bookCategory.categoryId),
      })
    ),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  const handleDeleteBook = async () => {
    try {
      await deleteBookMutation.mutateAsync(params.id);
      router.push(PATH.BOOKS);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  if (apiLoading) {
    return <SpinLoading />;
  }

  return (
    <div className='space-y-6'>
      <BackButton routeTo={PATH.BOOKS} />
      <Separator />
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Chi tiết sách</h2>
        <div className='flex gap-4'>
          <ImageUploader entityId={params.id} folder={`books/${book?.code}`} />
          <Link href={`${PATH.BOOKS}/${params.id}/edit`}>
            <Button>Sửa thông tin sách</Button>
          </Link>
          <Button
            variant={'destructive'}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Xóa thông tin sách
          </Button>
        </div>
      </div>
      <Separator />
      <div className='flex gap-4'>
        <div className='max-w-[40vw]'>
          <div className='grid gap-4 md:grid-flow-col'>
            {((imageUrlBook?.results as ImageResArr) || [])?.map(
              (image, index: number) => {
                return <ImageCard key={image.id || index} {...image} />;
              }
            )}
          </div>
        </div>
        <div className=''>
          <div className='mb-4 space-y-2'>
            <h3 className='text-2xl'>Thông tin cơ bản</h3>
            <p className='flex items-center gap-2 font-medium'>
              Mã sách: <span className='font-semibold'>{book?.code}</span>
            </p>
            <p className='flex items-center gap-2 font-medium'>
              Tên sách: <span className='font-semibold'>{book?.title}</span>
            </p>
            <p className='flex items-center gap-2 font-medium'>
              Tác giả:{' '}
              <span className='font-semibold'>
                {bookAuthorsRes.data
                  ?.map((author) => author?.result?.authorName)
                  .join(', ')}
              </span>
            </p>{' '}
            <p className='flex items-center gap-2 font-medium'>
              Danh mục:{' '}
              <span className='font-semibold'>
                {bookCategoriesRes.data
                  ?.map((cate) => cate?.result?.categoryName)
                  .join(', ')}
              </span>
            </p>{' '}
            <p className='flex items-center gap-2 font-medium'>
              Nhà xuất bản:{' '}
              <span className='font-semibold'>
                {book?.publisher.publisherName}
              </span>
            </p>
            <p className='flex items-center gap-2 font-medium'>
              Giá:{' '}
              <span className='font-semibold text-red-500'>
                {formatPrice(book?.price)}
              </span>
            </p>
            <p className='flex items-center gap-2 font-medium'>
              Ngôn ngữ: {book?.languages}
            </p>
            <p className='flex items-center gap-2 font-medium'>
              Tình trạng: <span className='text-blue-500'>{book?.status}</span>
            </p>
            <div>
              <p className='font-semibold'>Mô tả:</p>
              <p>
                {book?.description
                  ? book?.description
                  : 'Không có mô tả cho cuốn sách này'}
              </p>
            </div>{' '}
          </div>
          <div className='space-y-2'>
            <h3 className='text-xl font-semibold'>Thông tin thêm</h3>
            <p>Ngày xuất bản: {formatDate(book?.publicationDate)}</p>
            <p>Ngày tạo: {formatDate(book?.createdDate)}</p>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          await handleDeleteBook();
          setIsDeleteModalOpen(false);
        }}
        title='Xóa sách'
        description='Bạn có chắc chắn muốn xóa sách này? Hành động này không thể hoàn tác.'
        confirmText='Xóa'
        cancelText='Hủy'
        variant='destructive'
        isLoading={deletedLoading}
      />
    </div>
  );
}
