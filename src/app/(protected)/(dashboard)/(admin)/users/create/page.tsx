import dynamic from 'next/dynamic';

const UserForm = dynamic(() => import('../_components/user-form'), {
  ssr: false,
});

const Page = () => {
  return (
    <div className='container mx-auto md:px-20 md:py-4'>
      <UserForm />
    </div>
  );
};

export default Page;
