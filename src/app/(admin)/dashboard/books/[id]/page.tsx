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
import { useGetImageByTypeAndEntityID } from '@/hooks/use-images';
import useDebounce from '@/hooks/useDebounce';
import { formatDate, formatPrice } from '@/lib/utils';
import { ImageResArr } from '@/types/image-types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ImageCard from './_components/image-card';

export default function BooksDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { data: bookDetailData, isLoading: bookDetailLoading } =
    useBookSearchById(params.id);
  const { data: imageUrlBook, isLoading: imageBookLoading } =
    useGetImageByTypeAndEntityID({
      entityID: params.id,
    });
  const { deleteBookMutation } = useBookMutations();
  const apiLoading = useDebounce(bookDetailLoading || imageBookLoading, 300);
  const deletedLoading = useDebounce(deleteBookMutation.isPending, 300);
  const router = useRouter();
  const book = bookDetailData?.result;
  const imageContent: ImageResArr = imageUrlBook?.results;

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
    <div className="space-y-6">
      <BackButton />
      <Separator />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Chi tiết sách</h2>
        <div className="flex gap-4">
          <ImageUploader entityId={params.id} folder={`books/${book.code}`} />
          <Button
            variant={'default'}
            onClick={() => router.push(`${PATH.BOOKS}/${params.id}/edit`)}
          >
            Sửa thông tin sách
          </Button>
          <Button
            variant={'destructive'}
            onClick={() => setIsDeleteModalOpen(true)}
          >
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
              Mã sách: <span className="font-semibold">{book.code}</span>
            </p>
            <p className="flex items-center gap-2 font-medium">
              Tên sách: <span className="font-semibold">{book.title}</span>
            </p>
            <p className="flex items-center gap-2 font-medium">
              Giá:{' '}
              <span className="font-semibold text-red-500">
                {formatPrice(book.price)}
              </span>
            </p>
            <p className="flex items-center gap-2 font-medium">
              Ngôn ngữ: <span className="font-semibold">{book.languages}</span>
            </p>
            <p className="flex items-center gap-2 font-medium">
              Tình trạng: <span className="text-blue-500">{book.status}</span>
            </p>
            <div>
              <p className="font-semibold">Mô tả:</p>
              <p>
                {book.description
                  ? book.description
                  : 'Không có mô tả cho cuốn sách này'}
              </p>
            </div>{' '}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Thông tin thêm</h3>
            <p>Ngày xuất bản: {formatDate(book.publicationDate)}</p>
            <p>Ngày tạo: {formatDate(book.createdDate)}</p>
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
