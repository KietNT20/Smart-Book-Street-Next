import { formateDateVi, formatPrice } from '@/lib/utils';
import { Book } from '@/types/book-types';
import DOMPurify from 'dompurify';

type Props = {
  book: Book;
};

const BookInfo = ({ book }: Props) => {
  return (
    <div>
      <div className='mb-4 space-y-2'>
        <h3 className='text-2xl'>Thông tin cơ bản</h3>
        <p className='flex items-center gap-2 font-medium'>
          Mã sách: <span className='font-semibold'>{book?.isbn}</span>
        </p>
        <p className='flex items-center gap-2 font-medium'>
          Tên sách: <span className='font-semibold'>{book?.title}</span>
        </p>
        <p className='flex items-center gap-2 font-medium'>
          Tác giả:{' '}
          <span className='font-semibold'>
            {book?.bookAuthors?.map((author) => author?.authorName).join(', ')}
          </span>
        </p>{' '}
        <p className='flex items-center gap-2 font-medium'>
          Danh mục:{' '}
          <span className='font-semibold'>
            {book?.bookCategories?.map((cate) => cate?.categoryName).join(', ')}
          </span>
        </p>{' '}
        <p className='flex items-center gap-2 font-medium'>
          Nhà xuất bản:{' '}
          <span className='font-semibold'>{book.publisher?.publisherName}</span>
        </p>
        <p className='flex items-center gap-2 font-medium'>
          Giá:{' '}
          <span className='font-semibold text-red-500'>
            {formatPrice(book?.price)}
          </span>
        </p>
        <p className='flex items-center gap-2 font-medium'>
          Kích thước: {book?.size}
        </p>
        <p className='flex items-center gap-2 font-medium'>
          Ngôn ngữ: {book?.languages}
        </p>
        <p className='flex items-center gap-2 font-medium'>
          Tình trạng: <span className='text-blue-500'>{book?.status}</span>
        </p>
        <div className='rounded-md border p-2'>
          <p className='font-semibold'>Mô tả:</p>
          {book?.description ? (
            <div
              className='prose prose-sm mt-2 max-w-none'
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(book.description),
              }}
            />
          ) : (
            <p>Không có mô tả cho cuốn sách này</p>
          )}
        </div>{' '}
      </div>
      <div className='space-y-2'>
        <h3 className='text-xl font-semibold'>Thông tin thêm</h3>
        <p>Ngày xuất bản: {formateDateVi(book.publicationDate)}</p>
        <p>
          Lần cập nhật cuối:{' '}
          {book.lastUpdatedDate ? formateDateVi(book.lastUpdatedDate) : ''}
        </p>
      </div>
    </div>
  );
};

export default BookInfo;
