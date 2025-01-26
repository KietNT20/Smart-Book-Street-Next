'use client';
import SpinLoading from '@/components/spin/spin-loading';
import { Button } from '@/components/ui/button';
import { PATH } from '@/constant/path';
import { useBookSearchById } from '@/hooks/use-book-search';
import { formatDate, formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function BooksDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: bookDetailData, isLoading } = useBookSearchById(params.id);
  const book = bookDetailData?.result;

  if (isLoading) {
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

      {book && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium">Thông tin cơ bản</h3>
            <div>Mã sách: {book.code}</div>
            <div>Tên sách: {book.title}</div>
            <div>Giá: {formatPrice(book.price)}</div>
            <div>Ngôn ngữ: {book.languages}</div>
            <div>Tình trạng: {book.status}</div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Thông tin thêm</h3>
            <div>Ngày xuất bản: {formatDate(book.publicationDate)}</div>
            <div>Ngày tạo: {formatDate(book.createdDate)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
