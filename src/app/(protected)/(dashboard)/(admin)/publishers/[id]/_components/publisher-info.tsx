import { Publisher } from '@/types/publisher-types';

export default function PublisherInfo<T extends Publisher>({
  publisher,
}: {
  publisher: T;
}) {
  return (
    <div className='w-full md:w-3/4'>
      <div className='h-full rounded-lg bg-background p-6 shadow'>
        <h1 className='mb-4 text-3xl font-bold'>{publisher?.publisherName}</h1>

        <div className='mb-4 grid grid-cols-1 gap-4'>
          <div>
            <h2 className='mb-2 text-lg font-semibold'>Thông tin liên hệ</h2>
            <ul className='space-y-2'>
              <li className='flex items-start'>
                <span className='w-20 font-medium'>Địa chỉ:</span>
                <span>{publisher?.address || 'Chưa có'}</span>
              </li>
              <li className='flex items-start'>
                <span className='w-20 font-medium'>Điện thoại:</span>
                <span>{publisher?.phone || 'Chưa có'}</span>
              </li>
              <li className='flex items-start'>
                <span className='w-20 font-medium'>Email:</span>
                <span>{publisher?.email || 'Chưa có'}</span>
              </li>
              <li className='flex items-start'>
                <span className='w-20 font-medium'>Website:</span>
                <a
                  href={publisher?.website || 'Chưa có'}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline'
                >
                  {publisher?.website || 'Chưa có'}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className='mb-2 text-lg font-semibold'>Về chúng tôi:</h2>
            <p className='text-muted-foreground'>
              {publisher?.description || 'Chưa có'}
            </p>

            <div className='mt-4'>
              <div className='rounded-lg bg-blue-50 p-3'>
                <p className='font-medium text-blue-800'>
                  Số lượng sách xuất bản: {publisher?.books?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
