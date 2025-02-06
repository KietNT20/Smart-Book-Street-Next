'use client';
import { ConfirmModal } from '@/components/confirm-modal';
import ImageUploader from '@/components/image-upload/image-uploader';
import SpinLoading from '@/components/spin/spin-loading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PATH } from '@/enums/path';
import { useBookSearchById } from '@/hooks/use-book-search';
import { useGetImageByTypeAndEntityID } from '@/hooks/use-images';
import useDebounce from '@/hooks/useDebounce';
import { formatDate, formatPrice } from '@/lib/utils';
import { ImageResArr } from '@/types/image-types';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBookList } from '../_lib/use-book-operations';
import { useBookPageState } from '../_lib/use-book-page-state';
import ImageCard from './_components/image-card';

export default function BooksDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { pagination, searchCriteria, deleteId, setDeleteId } =
    useBookPageState();
  const { handleDelete, deleteBookMutation } = useBookList({
    pagination,
    searchCriteria,
  });

  const { data: bookDetailData, isLoading: bookDetailLoading } =
    useBookSearchById(params.id);
  const { data: imageUrlBook, isLoading: imageBookLoading } =
    useGetImageByTypeAndEntityID({
      entityID: params.id,
    });
  const apiLoading = useDebounce(bookDetailLoading || imageBookLoading, 300);
  const deletedLoading = useDebounce(deleteBookMutation.isPending, 300);
  const router = useRouter();
  const book = bookDetailData?.result;
  const imageContent: ImageResArr = imageUrlBook?.results;

  const handleDeleteBook = () => {
    setDeleteId(book?.id);
    router.push(PATH.BOOKS);
  };

  if (apiLoading) {
    return <SpinLoading />;
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="gap-2"
        onClick={() => router.push(PATH.BOOKS)}
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Button>

      <Separator />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Chi tiết sách</h2>
        <div className="flex gap-4">
          <ImageUploader entityId={params.id} />
          <Button variant={'destructive'} onClick={handleDeleteBook}>
            Xóa thông tin sách
          </Button>
        </div>
      </div>
      <Separator />
      <div className="flex gap-4">
        <div className="max-w-[40vw]">
          <div className="grid gap-4 md:grid-flow-col">
            {imageContent?.map((image, index: number) => {
              return <ImageCard key={image.id || index} {...image} />;
            })}
          </div>
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
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            handleDelete(deleteId);
            setDeleteId(null);
          }
        }}
        title="Xóa sách"
        description="Bạn có chắc chắn muốn xóa sách này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        isLoading={deletedLoading}
      />
    </div>
  );
}
