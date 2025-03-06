'use client';

import BackButton from '@/components/back-btn/back-button';
import { ConfirmModal } from '@/components/confirm-modal';
import ImageUploader from '@/components/image-upload/image-uploader';
import SpinLoading from '@/components/spin/spin-loading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PATH } from '@/enums/path';
import { ImageResArr } from '@/types/image-types';
import Link from 'next/link';
import { useState } from 'react';
import BookInfo from './_components/book-info';
import EnhancedImageGallery from './_components/enhanced-image-gallery';
import { useBookDetail } from './_lib/useBookDetail';

export default function BooksDetailPage({
  params
}: {
  params: { id: string };
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {
    imageUrlBook,
    deleteBookMutation,
    apiLoading,
    deletedLoading,
    book,
    bookInfoProps,
    router
  } = useBookDetail({ id: params.id });

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
      <div className='flex items-center justify-between'>
        <BackButton routeTo={PATH.BOOKS} />
        <div className='flex gap-2'>
          <Link href={`${PATH.BOOKS}/${params.id}/edit`}>
            <Button variant='outline'>Sửa thông tin</Button>
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
        <h3 className='text-muted-foreground'>Mã sách: {book?.code}</h3>
        <Separator className='my-4' />

        <Tabs defaultValue='info' className='w-full'>
          <TabsList className='mb-4 grid w-full grid-cols-2'>
            <TabsTrigger value='info'>Thông tin sách</TabsTrigger>
            <TabsTrigger value='images'>
              Hình ảnh (
              {((imageUrlBook?.results as ImageResArr) || [])?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value='info' className='space-y-4'>
            <BookInfo {...bookInfoProps} />
          </TabsContent>

          <TabsContent value='images'>
            <div className='mb-4 flex justify-between'>
              <h3 className='text-lg font-semibold'>Thư viện hình ảnh</h3>
              <ImageUploader
                entityId={params.id}
                folder={`books/${book?.code}`}
              />
            </div>
            <EnhancedImageGallery
              images={(imageUrlBook?.results as ImageResArr) || []}
              bookCode={book?.code}
            />
          </TabsContent>
        </Tabs>
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
