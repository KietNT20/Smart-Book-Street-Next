'use client';

import { useUserById } from '@/hooks/use-user';
import { useParams } from 'next/navigation';
import UserForm from '../../../_components/user-form';

const UserFormEdit = () => {
  const params = useParams();
  const userId = params.userId as string;
  const { user } = useUserById(userId);
  return (
    <div className='container mx-auto md:px-32 md:py-10'>
      <div>{user && <UserForm userToEdit={user} />}</div>
    </div>
  );
};

export default UserFormEdit;
