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
import { BookFormValues } from '@/lib/zod';
import { ImageResArr } from '@/types/image-types';
import Link from 'next/link';
import { BookDialog } from '../_components/book-dialog';
import { BookForm } from '../_components/book-form';
import { useBookOperations } from '../_lib/use-book-operations';
import { useBookPageState } from '../_lib/use-book-page-state';
import ImageCard from './_components/image-card';

export default function BooksDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    pagination,
    searchCriteria,
    modalState,
    setModalState,
    selectedBook,
    setSelectedBook,
    deleteId,
    setDeleteId,
  } = useBookPageState();

  const {
    handleSubmit: handleBookSubmit,
    handleDelete,
    updateBookMutation,
    deleteBookMutation,
  } = useBookOperations({
    pagination,
    searchCriteria,
    onSuccess: () => {
      setModalState({ type: 'none' });
      setSelectedBook(undefined);
    },
  });
  const { data: bookDetailData, isLoading: bookDetailLoading } =
    useBookSearchById(params.id);
  const { data: imageUrlBook, isLoading: imageBookLoading } =
    useGetImageByTypeAndEntityID({
      entityID: params.id,
    });
  const book = bookDetailData?.result;
  const imageContent: ImageResArr = imageUrlBook?.results;
  const apiLoading = useDebounce(bookDetailLoading || imageBookLoading, 300);
  const updatedLoading = useDebounce(updateBookMutation.isPending, 300);
  const deletedLoading = useDebounce(deleteBookMutation.isPending, 300);

  const handleFormSubmit = async (data: BookFormValues) => {
    await handleBookSubmit(data, selectedBook);
  };

  const handleEditBook = () => {
    setSelectedBook(book);
    setModalState({ type: 'form' });
  };

  const handleDeleteBook = () => {
    setDeleteId(book?.id);
  };

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
      <Separator />
      <div className="flex gap-4">
        <ImageUploader entityId={params.id} />
        <Button variant={'default'} onClick={handleEditBook}>
          Sửa thông tin sách
        </Button>
        <Button variant={'destructive'} onClick={handleDeleteBook}>
          Xóa thông tin sách
        </Button>
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
      <BookDialog
        isOpen={modalState.type === 'form'}
        onClose={() => setModalState({ type: 'none' })}
        title={selectedBook ? 'Cập nhật sách' : 'Thêm sách mới'}
      >
        <BookForm
          book={selectedBook}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalState({ type: 'none' })}
          isLoading={updatedLoading}
        />
      </BookDialog>
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
