import UserStoreForm from './_components/user-store-form';

const UserStoresPage = () => {
  return (
    <div className='container mx-auto p-4 md:px-24'>
      <h1 className='text-2xl font-bold'>Đơn đăng ký</h1>
      <div className='mt-4 rounded-lg border bg-background p-16 shadow-md'>
        <UserStoreForm />
      </div>
    </div>
  );
};

export default UserStoresPage;
