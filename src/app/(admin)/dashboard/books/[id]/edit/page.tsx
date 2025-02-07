'use client';

import BackButton from '@/components/back-btn/back-button';
import { Separator } from '@/components/ui/separator';
import { PATH } from '@/enums/path';
import { useBookSearchById } from '@/hooks/use-book-search';
import { useBookMutations } from '@/hooks/use-books';
import { useToast } from '@/hooks/use-toast';
import { BookFormValues } from '@/lib/zod';
import { useParams, useRouter } from 'next/navigation';
import { BookForm } from '../../_components/book-form';

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const bookId = params.id as string;

  const { data: book } = useBookSearchById(bookId);
  const { updateBookMutation } = useBookMutations();

  const handleSubmit = async (data: BookFormValues) => {
    await updateBookMutation.mutateAsync(
      { id: bookId, ...data },
      {
        onSuccess: (data) => {
          if (data?.isSuccess) {
            router.back();
            toast({
              title: 'Cập nhật thành công',
              description: 'Thông tin sách đã được cập nhật',
              variant: 'success',
            });
          }
        },
      }
    );
  };

  return (
    <div className="container relative mx-auto">
      <div className="space-y-2">
        <div className="">
          <BackButton />
        </div>
        <div className="rounded-lg border-2 px-20 py-4">
          <h3 className="text-2xl font-bold">Cập nhật sách</h3>
          <Separator className="my-4" />
          <div className="">
            {book && (
              <BookForm
                book={book?.result}
                onSubmit={handleSubmit}
                onCancel={() => router.push(PATH.BOOKS)}
                isLoading={updateBookMutation.isPending}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
