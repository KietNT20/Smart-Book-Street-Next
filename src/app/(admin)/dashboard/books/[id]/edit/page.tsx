'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PATH } from '@/enums/path';
import { useBookSearchById } from '@/hooks/use-book-search';
import { useBookMutations } from '@/hooks/use-books';
import { BookFormValues } from '@/lib/zod';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { BookForm } from '../../_components/book-form';

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const { data: book } = useBookSearchById(bookId);
  const { updateBookMutation } = useBookMutations();

  const handleSubmit = async (data: BookFormValues) => {
    await updateBookMutation.mutateAsync({ id: bookId, ...data });
  };

  return (
    <div className="container relative mx-auto">
      <div className="space-y-2">
        <div className="">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => router.push(PATH.BOOKS)}
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </div>
        <div className="rounded-lg border-2 bg-white px-20 py-4">
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
