import dynamic from 'next/dynamic';

const PublisherForm = dynamic(() => import('../_components/publisher-form'), {
  ssr: false,
});

const CreatePublisherPage = () => {
  return (
    <div className='container mx-auto md:px-32 md:py-4'>
      <PublisherForm />
    </div>
  );
};

export default CreatePublisherPage;
