import RoleGuard from '@/components/role-guard/role-guard';
import { RoleEnums } from '@/enums/role';
import { AuthorForm } from '../../_components/author-form';

const EditPage = ({ params }: { params: { id: string } }) => {
  return (
    <RoleGuard allowedRoles={RoleEnums.PUBLISHER_MANAGER}>
      <AuthorForm authorId={params.id} />
    </RoleGuard>
  );
};

export default EditPage;
