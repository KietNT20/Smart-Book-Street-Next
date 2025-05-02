'use client';

import BackButton from '@/components/back-btn/back-button';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageFallback } from '@/constant/storage';
import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { usePublisherById } from '@/hooks/use-publisher';
import { Image } from 'antd';
import Link from 'next/link';
import { LoadingSkeleton } from './_components/loading-skeleton';
import PublisherInfo from './_components/publisher-info';

export default function PublisherDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { publisher, isLoadingPublisher, errorPublisher } = usePublisherById(
    params.id
  );
  const isLoading = isLoadingPublisher;
  useEntityBreadcrumb(
    PATH.PUBLISHERS,
    'Nhà xuất bản',
    params.id,
    publisher?.publisherName
  );

  if (errorPublisher || !publisher) {
    return (
      <div className='container mx-auto p-4'>
        <div className='text-center text-red-500'>
          <h1 className='text-2xl font-bold'>Đã xảy ra lỗi</h1>
          <p>Không thể tải thông tin nhà xuất bản. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  // Get publisher image
  const publisherImage = publisher.images?.find(
    (image) => image.type === 'publisher_main'
  )?.url;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='flex items-center justify-between'>
        <BackButton />
        <Link href={`${PATH.PUBLISHERS}/${params.id}/edit`}>
          <Button variant={'darker'}>Chỉnh sửa</Button>
        </Link>
      </div>
      <h1 className='my-4 text-2xl font-bold'>Thông tin nhà xuất bản</h1>
      {/* Header Section */}
      <div className='mb-8 flex flex-col gap-6 md:flex-row'>
        {/* Publisher Logo */}
        <div className='w-full md:w-1/2'>
          <div className='rounded-lg bg-background p-4 shadow'>
            {publisherImage ? (
              <div className='relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg'>
                <Image
                  src={publisherImage}
                  alt={publisher.publisherName}
                  fallback={ImageFallback.SRC}
                />
              </div>
            ) : (
              <div className='flex h-64 w-full items-center justify-center rounded bg-gray-200'>
                <span className='text-zinc-500'>Không có hình ảnh</span>
              </div>
            )}
          </div>
        </div>

        <PublisherInfo publisher={publisher} />
      </div>

      {/* Tabs Navigation and Content using shadcn/ui */}
      <Tabs defaultValue='books' className='w-full'>
        <TabsList className='mb-6'>
          <TabsTrigger value='books'>Danh sách sách</TabsTrigger>
          {/* <TabsTrigger value='about'>Thông tin thêm</TabsTrigger> */}
        </TabsList>

        <TabsContent value='books'>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {publisher.books &&
              publisher.books.map((book) => (
                <div
                  key={book.id}
                  className='overflow-hidden rounded-lg border border-ring bg-card shadow'
                >
                  <div className='flex h-48 items-center justify-center overflow-hidden bg-card'>
                    {book.images ? (
                      <Image.PreviewGroup
                        items={book.images?.map((image) => image.url)}
                      >
                        <Image
                          width={200}
                          src={book.images?.[0]?.url}
                          alt={book.images?.[0]?.altText || book.title}
                          fallback={ImageFallback.SRC}
                        />
                      </Image.PreviewGroup>
                    ) : (
                      <div className='flex h-40 w-32 items-center justify-center bg-card'>
                        <span className='text-sm text-card-foreground'>
                          Không có ảnh
                        </span>
                      </div>
                    )}
                  </div>
                  <div className='p-4'>
                    <h3 className='mb-2 line-clamp-2 truncate text-ellipsis font-bold'>
                      {book.title}
                    </h3>
                    <p className='mb-2 text-sm text-muted-foreground'>
                      ISBN: {book.isbn}
                    </p>
                    <p className='mb-3 font-semibold text-red-500'>
                      {book.price.toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                </div>
              ))}

            {(!publisher.books || publisher.books.length === 0) && (
              <div className='col-span-full py-10 text-center'>
                <p className='text-muted-foreground'>
                  Không có sách nào từ nhà xuất bản này.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* <TabsContent value='about'></TabsContent> */}
      </Tabs>
    </div>
  );
}
