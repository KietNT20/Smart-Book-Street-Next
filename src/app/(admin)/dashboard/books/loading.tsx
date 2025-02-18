import SpinLoading from '@/components/spin/spin-loading';

const loading = () => {
  return (
    <div className='flex h-screen items-center justify-center'>
      <SpinLoading />
    </div>
  );
};

export default loading;
