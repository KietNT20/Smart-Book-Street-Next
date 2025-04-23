import dynamic from 'next/dynamic';

const StoreFormEdit = dynamic(() => import('./_components/store-form-edit'), {
  ssr: false,
});

export default function Page() {
  return (
    <div className='container mx-auto md:px-8 md:py-4'>
      <StoreFormEdit />
    </div>
  );
}
