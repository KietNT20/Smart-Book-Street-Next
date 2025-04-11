import RoleGuard from '@/components/role-guard/role-guard';
import { Separator } from '@/components/ui/separator';
import { RoleEnums } from '@/enums/role';
import { AuthorForm } from '../_components/author-form';

const CreatePage = () => {
  return (
    <RoleGuard allowedRoles={RoleEnums.PUBLISHER_MANAGER}>
      <div className='container relative mx-auto overflow-hidden'>
        <div className='rounded-lg border-2 md:px-20 md:pb-7 md:pt-10'>
          <h3 className='text-2xl font-bold'>Thêm tác giả mới</h3>
          <Separator className='my-4' />
          <AuthorForm />
        </div>
      </div>
    </RoleGuard>
  );
};

export default CreatePage;
