import StoreForm from '../_components/store-form';

const CreateStorePage = () => {
  return (
    <div>
      <h2 className='text-2xl font-bold'>Tạo cửa hàng</h2>
      <p className='text-sm text-muted-foreground'>
        Nhập thông tin cửa hàng của bạn để tạo mới.
      </p>
      <div className='mt-4'>
        <StoreForm />
      </div>
    </div>
  );
};

export default CreateStorePage;
