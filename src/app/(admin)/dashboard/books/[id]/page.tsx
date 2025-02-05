'use client';
import ImageUploader from '@/components/image-upload/image-uploader';
import SpinLoading from '@/components/spin/spin-loading';
import { Button } from '@/components/ui/button';
import { PATH } from '@/enums/path';
import { useBookSearchById } from '@/hooks/use-book-search';
import { useGetImageByTypeAndEntityID } from '@/hooks/use-images';
import useDebounce from '@/hooks/useDebounce';
import { formatDate, formatPrice } from '@/lib/utils';
import { ImageResArr } from '@/types/image-types';
import Image from 'next/image';
import Link from 'next/link';

export default function BooksDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: bookDetailData, isLoading: bookDetailLoading } =
    useBookSearchById(params.id);
  const { data: imageUrlBook, isLoading: imageBookLoading } =
    useGetImageByTypeAndEntityID({
      entityID: params.id,
    });
  const book = bookDetailData?.result;
  const imageContent: ImageResArr = imageUrlBook?.results;
  const apiLoading = useDebounce(bookDetailLoading || imageBookLoading, 300);

  if (apiLoading) {
    return <SpinLoading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Chi tiết sách</h2>
        <Link href={PATH.BOOKS}>
          <Button variant="outline">Quay lại</Button>
        </Link>
      </div>

      {/* {!imageContent?.length && <ImageUploader entityId={params.id} />} */}
      <ImageUploader entityId={params.id} />

      <div className="flex gap-4">
        <div className="grid gap-4 md:grid-cols-3">
          {imageContent?.map((image, index: number) => {
            return (
              <div key={image.id || index} className="relative h-72 w-52">
                <Image src={image.url} alt={image.altText} fill />
              </div>
            );
          })}
        </div>
        <div className="">
          <div className="mb-4 space-y-2">
            <h3 className="text-xl font-semibold">Thông tin cơ bản</h3>
            <p className="flex items-center gap-2 font-medium">
              Mã sách: <span>{book.code}</span>
            </p>
            <p className="flex items-center gap-2 font-medium">
              Tên sách: <span>{book.title}</span>
            </p>
            <p className="flex items-center gap-2 font-medium">
              Giá: <span>{formatPrice(book.price)}</span>
            </p>
            <p className="flex items-center gap-2 font-medium">
              Ngôn ngữ: <span>{book.languages}</span>
            </p>
            <p className="flex items-center gap-2 font-medium">
              Tình trạng: <span>{book.status}</span>
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Thông tin thêm</h3>
            <p>Ngày xuất bản: {formatDate(book.publicationDate)}</p>
            <p>Ngày tạo: {formatDate(book.createdDate)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
