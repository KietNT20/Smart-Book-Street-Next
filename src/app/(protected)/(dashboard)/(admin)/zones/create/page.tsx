import dynamic from 'next/dynamic';

const ZoneForm = dynamic(() => import('../_components/zone-form'), {
  ssr: false,
});

const Page = () => {
  return (
    <div className='container mx-auto md:px-8 md:py-8'>
      <ZoneForm />
    </div>
  );
};

export default Page;
