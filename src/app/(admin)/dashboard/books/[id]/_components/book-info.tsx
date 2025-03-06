import { formatDate, formatPrice } from '@/lib/utils';
import { Book } from '@/types/book-types';

type Props = {
  book: Book;
  bookAuthorsRes: { data: any[] };
  bookCategoriesRes: { data: any[] };
};

const BookInfo = ({ book, bookAuthorsRes, bookCategoriesRes }: Props) => {
  return (
    <div>
      <div className='mb-4 space-y-2'>
        <h3 className='text-2xl'>Thông tin cơ bản</h3>
        <p className='flex items-center gap-2 font-medium'>
          Mã sách: <span className='font-semibold'>{book?.code}</span>
        </p>
        <p className='flex items-center gap-2 font-medium'>
          Tên sách: <span className='font-semibold'>{book?.title}</span>
        </p>
        <p className='flex items-center gap-2 font-medium'>
          Tác giả:{' '}
          <span className='font-semibold'>
            {bookAuthorsRes.data
              ?.map((author) => author?.result?.authorName)
              .join(', ')}
          </span>
        </p>{' '}
        <p className='flex items-center gap-2 font-medium'>
          Danh mục:{' '}
          <span className='font-semibold'>
            {bookCategoriesRes.data
              ?.map((cate) => cate?.result?.categoryName)
              .join(', ')}
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
          Ngôn ngữ: {book?.languages}
        </p>
        <p className='flex items-center gap-2 font-medium'>
          Tình trạng: <span className='text-blue-500'>{book?.status}</span>
        </p>
        <div>
          <p className='font-semibold'>Mô tả:</p>
          <p>
            {book?.description
              ? book?.description
              : 'Không có mô tả cho cuốn sách này'}
          </p>
        </div>{' '}
      </div>
      <div className='space-y-2'>
        <h3 className='text-xl font-semibold'>Thông tin thêm</h3>
        <p>Ngày xuất bản: {formatDate(book?.publicationDate)}</p>
        <p>
          Ngày tạo:{' '}
          {book.createdDate ? formatDate(book.createdDate.toString()) : ''}
        </p>
      </div>
    </div>
  );
};

export default BookInfo;
