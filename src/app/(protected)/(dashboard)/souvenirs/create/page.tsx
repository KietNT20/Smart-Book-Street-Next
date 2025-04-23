import dynamic from 'next/dynamic';

const SouvenirForm = dynamic(() => import('../_components/souvenir-form'), {
  ssr: false,
});

const Page = () => {
  return (
    <div className='container mx-auto md:px-32 md:py-4'>
      <SouvenirForm />
    </div>
  );
};

export default Page;
