import { User } from '@/types/user-types';

type Props = { userToEdit: User };

const UserForm = ({ userToEdit }: Props) => {
  console.log('user', userToEdit);
  return <div>User-form</div>;
};

export default UserForm;
