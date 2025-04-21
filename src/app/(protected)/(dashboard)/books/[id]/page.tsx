'use client';

import BackButton from '@/components/back-btn/back-button';
import { ConfirmModal } from '@/components/confirm-modal';
import SpinLoading from '@/components/spin/spin-loading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PATH } from '@/enums/path';
import Link from 'next/link';
import { useState } from 'react';
import BookInfo from './_components/book-info';
import ImageGalleryBook from './_components/image-gallery-book';
import { useBookDetail } from './_lib/use-book-detail';

export default function BooksDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {
    deletedLoading,
    bookDetailPending,
    bookDetailLoading,
    book,
    router,
    deleteBook,
  } = useBookDetail({ id: params.id });

  const handleDeleteBook = () => {
    deleteBook(params.id);
    router.push(PATH.BOOKS);
  };

  if (bookDetailPending || bookDetailLoading) {
    return <SpinLoading />;
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <BackButton routeTo={PATH.BOOKS} />
        <div className='flex gap-2'>
          <Link href={`${PATH.BOOKS}/${params.id}/edit`}>
            <Button>Sửa thông tin</Button>
          </Link>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Xóa sách
          </Button>
        </div>
      </div>

      <div className='rounded-lg border bg-card p-6 shadow'>
        <h2 className='mb-4 text-2xl font-bold'>
          {book?.title || 'Chi tiết sách'}
        </h2>
        <h3 className='text-muted-foreground'>Mã sách: {book?.isbn}</h3>
        <Separator className='my-4' />

        <Tabs defaultValue='info' className='w-full'>
          <TabsList className='mb-4 grid w-full grid-cols-2'>
            <TabsTrigger value='info'>Thông tin sách</TabsTrigger>
            <TabsTrigger value='images'>
              Hình ảnh ({(book?.images || [])?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value='info' className='space-y-4'>
            {book && <BookInfo book={book} />}
          </TabsContent>

          <TabsContent value='images'>
            <h3 className='text-lg font-semibold'>Thư viện hình ảnh</h3>
            <ImageGalleryBook
              images={book?.images || []}
              bookCode={book?.isbn}
            />
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          handleDeleteBook();
          setIsDeleteModalOpen(false);
        }}
        title='Xóa sách'
        description='Bạn có chắc chắn muốn xóa Sách này không? Hành động này không thể hoàn tác.'
        confirmText='Xóa'
        cancelText='Hủy'
        variant='destructive'
        isLoading={deletedLoading}
      />
    </div>
  );
}
