import StreetForm from '../_components/street-form';

export default function CreateStreetPage() {
  return (
    <div className='container mx-auto p-4 md:px-32 md:py-4'>
      <StreetForm mode='create' />
    </div>
  );
}
