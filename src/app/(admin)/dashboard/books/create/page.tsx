'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PATH } from '@/enums/path';
import { useBookMutations } from '@/hooks/use-books';
import { useToast } from '@/hooks/use-toast';
import { BookFormValues } from '@/lib/zod';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BookForm } from '../_components/book-form';

export default function CreateBookPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { createBookMutation } = useBookMutations();

  const handleSubmit = async (data: BookFormValues) => {
    try {
      await createBookMutation.mutateAsync(data, {
        onSuccess: () => {
          toast({
            title: 'Thêm mới thành công',
            description: 'Sách đã được thêm vào hệ thống',
            variant: 'success',
          });
          router.push(PATH.BOOKS);
        },
      });
    } catch (error) {
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Không thể lưu thông tin sách. Vui lòng thử lại',
        variant: 'destructive',
      });
      console.error('Error:', error);
    }
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
          <h3 className="text-2xl font-bold">Thêm sách mới</h3>
          <Separator className="my-4" />
          <div className="">
            <BookForm
              onSubmit={handleSubmit}
              onCancel={() => router.push(PATH.BOOKS)}
              isLoading={createBookMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
