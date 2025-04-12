import { User } from '@/types/user-types';

type Props = { user: User };

const UserForm = ({ user }: Props) => {
  console.log('user', user);
  return <div>User-form</div>;
};

export default UserForm;
