'use client';

import { Separator } from '@/components/ui/separator';
import { PATH } from '@/enums/path';
import { useGetAuthorById } from '@/hooks/use-author';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { AuthorForm } from '../../_components/author-form';

const EditPage = ({ params }: { params: { id: string } }) => {
  const { data: authorData, isLoading: isLoadingAuthor } = useGetAuthorById(
    params.id
  );
  useEntityBreadcrumb(
    PATH.ADMIN_AUTHORS,
    'Tác giả',
    params.id,
    authorData?.result.authorName,
    true
  );
  return (
    <div className='container relative mx-auto overflow-hidden'>
      <div className='rounded-lg border-2 md:px-20 md:pb-7 md:pt-10'>
        <h3 className='text-2xl font-bold'>Cập nhật tác giả</h3>
        <Separator className='my-4' />
        {authorData && (
          <AuthorForm
            author={authorData?.result}
            isLoadingAuthor={isLoadingAuthor}
          />
        )}
      </div>
    </div>
  );
};

export default EditPage;
