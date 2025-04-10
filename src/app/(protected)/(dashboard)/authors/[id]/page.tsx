'use client';
import BackButton from '@/components/back-btn/back-button';
import RoleGuard from '@/components/role-guard/role-guard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PATH } from '@/enums/path';
import { RoleEnums } from '@/enums/role';
import { useGetAuthorById } from '@/hooks/use-author';
import { Author } from '@/types/author-types';
import Link from 'next/link';
import AuthorInfo from './_components/author-info';

type AuthorDetail = {
  result: Author;
  isSuccess: boolean;
  message: string;
};

const AuthorDetailPage = ({ params }: { params: { id: string } }) => {
  const { data: authorRes } = useGetAuthorById<AuthorDetail>(params.id);

  if (!authorRes?.isSuccess) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <h1 className='text-2xl font-bold text-red-500'>
          {authorRes?.message || 'Không tìm thấy tác giả'}
        </h1>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={RoleEnums.PUBLISHER_MANAGER}>
      <div className='flex items-center justify-between'>
        <BackButton />
        <Button variant={'primaryblue'}>
          <Link href={`${PATH.ADMIN_AUTHORS}/${params.id}/edit`}>
            Chỉnh sửa
          </Link>
        </Button>
      </div>
      <Separator className='my-4' />
      <AuthorInfo author={authorRes?.result} />
    </RoleGuard>
  );
};

export default AuthorDetailPage;
