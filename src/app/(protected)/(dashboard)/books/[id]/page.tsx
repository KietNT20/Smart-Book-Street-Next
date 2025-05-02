'use client';

import BackButton from '@/components/back-btn/back-button';
import LoadingSpinner from '@/components/spin/loading-spinner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PATH } from '@/enums/path';
import { useGetBookByID } from '@/hooks/use-book-search';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import Link from 'next/link';
import BookInfo from './_components/book-info';
import ImageGalleryBook from './_components/image-gallery-book';

export default function BooksDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { bookData: book, isLoading: bookDetailLoading } = useGetBookByID(
    params.id as string
  );

  useEntityBreadcrumb(
    PATH.BOOKS,
    'Sách',
    params.id,
    book?.title || 'Chi tiết sách'
  );

  if (bookDetailLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <BackButton />
        <div className='flex gap-2'>
          <Link href={`${PATH.BOOKS}/${params.id}/edit`} passHref>
            <Button>Sửa thông tin</Button>
          </Link>
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
    </div>
  );
}
