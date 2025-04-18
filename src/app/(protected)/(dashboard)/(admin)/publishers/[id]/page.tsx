'use client';

import BackButton from '@/components/back-btn/back-button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useDebounce from '@/hooks/use-debounce';
import { usePublisherById } from '@/hooks/use-publisher';
import { Image } from 'antd';

export default function PublisherDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { publisher, isLoadingPublisher, errorPublisher } = usePublisherById(
    params.id
  );
  const isLoading = useDebounce(isLoadingPublisher, 300);

  if (isLoading) {
    return (
      <div className='container mx-auto p-4'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-6 md:flex-row'>
            <Skeleton className='h-64 w-full rounded-lg md:w-1/4' />
            <div className='w-full space-y-4 md:w-3/4'>
              <Skeleton className='h-10 w-3/4' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-2/3' />
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-full' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-full' />
                </div>
              </div>
            </div>
          </div>
          <Skeleton className='h-10 w-64' />
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div key={i} className='space-y-4'>
                  <Skeleton className='h-48 w-full rounded-lg' />
                  <Skeleton className='h-6 w-3/4' />
                  <Skeleton className='h-4 w-1/2' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-10 w-1/2' />
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className='container mx-auto p-4'>
      <BackButton />
      <h1 className='my-4 text-2xl font-bold'>Thông tin nhà xuất bản</h1>
      {/* Header Section */}
      <div className='mb-8 flex flex-col gap-6 md:flex-row'>
        {/* Publisher Logo */}
        <div className='w-full md:w-1/4'>
          <div className='rounded-lg bg-white p-4 shadow'>
            {publisherImage ? (
              <div className='relative h-60 w-full'>
                <Image src={publisherImage} alt={publisher.publisherName} />
              </div>
            ) : (
              <div className='flex h-60 w-full items-center justify-center rounded bg-gray-200'>
                <span className='text-gray-500'>Không có hình ảnh</span>
              </div>
            )}
          </div>
        </div>

        {/* Publisher Info */}
        <div className='w-full md:w-3/4'>
          <div className='h-full rounded-lg bg-white p-6 shadow'>
            <h1 className='mb-4 text-3xl font-bold text-gray-800'>
              {publisher.publisherName}
            </h1>

            <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <h2 className='mb-2 text-lg font-semibold'>
                  Thông tin liên hệ
                </h2>
                <ul className='space-y-2'>
                  <li className='flex items-start'>
                    <span className='w-20 font-medium'>Địa chỉ:</span>
                    <span>{publisher.address}</span>
                  </li>
                  <li className='flex items-start'>
                    <span className='w-20 font-medium'>Điện thoại:</span>
                    <span>{publisher.phone}</span>
                  </li>
                  <li className='flex items-start'>
                    <span className='w-20 font-medium'>Email:</span>
                    <span>{publisher.email}</span>
                  </li>
                  <li className='flex items-start'>
                    <span className='w-20 font-medium'>Website:</span>
                    <a
                      href={publisher.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'
                    >
                      {publisher.website}
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className='mb-2 text-lg font-semibold'>Tổng quan</h2>
                <p className='text-gray-700'>{publisher.description}</p>

                <div className='mt-4'>
                  <div className='rounded-lg bg-blue-50 p-3'>
                    <p className='font-medium text-blue-800'>
                      Số lượng sách xuất bản: {publisher.books?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                  className='overflow-hidden rounded-lg bg-card shadow'
                >
                  <div className='flex h-48 items-center justify-center bg-card'>
                    {book.images ? (
                      <Image.PreviewGroup
                        items={book.images.map((image) => image.url)}
                      >
                        <Image
                          width={200}
                          src={
                            book.images[0]?.url ||
                            '/public/No-Image-Placeholder.png'
                          }
                          alt={book.images[0]?.altText || book.title}
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
                    <p className='mb-2 text-sm text-gray-500'>
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
                <p className='text-gray-500'>
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
