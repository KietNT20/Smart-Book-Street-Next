import { formateDateVi, formatPrice } from '@/lib/utils';
import { Author } from '@/types/author-types';
import Link from 'next/link';

type Props = {
  author: Author;
};

const AuthorInfo = ({ author }: Props) => {
  return (
    <div className='overflow-hidden rounded-lg bg-white shadow-lg'>
      {/* Header với thông tin cơ bản */}
      <div className='md:flex'>
        <div className='flex items-center justify-center p-6 md:w-1/3'></div>

        <div className='p-6 md:w-2/3'>
          <h1 className='mb-4 text-3xl font-bold text-gray-800'>
            {author.authorName}
          </h1>

          <div className='mb-6'>
            <div className='mb-2 flex items-center'>
              <span className='w-32 text-gray-600'>Quốc tịch:</span>
              <span className='font-medium'>{author.nationality}</span>
            </div>

            <div className='mb-2 flex items-center'>
              <span className='w-32 text-gray-600'>Ngày sinh:</span>
              <span className='font-medium'>{formateDateVi(author.dob)}</span>
            </div>
          </div>

          <div className='mb-6'>
            <h2 className='mb-2 text-xl font-semibold'>Tiểu sử</h2>
            <p className='leading-relaxed text-gray-700'>{author.biography}</p>
          </div>
        </div>
      </div>

      {/* Danh sách tác phẩm */}
      <div className='border-t border-gray-200 p-6'>
        <h2 className='mb-4 text-2xl font-semibold'>Tác phẩm</h2>

        {author.bookAuthors && author.bookAuthors.length > 0 ? (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {author.bookAuthors.map((bookAuthor) => (
              <div
                key={bookAuthor.id}
                className='rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md'
              >
                <Link href={`/books/${bookAuthor.bookId}`} className='block'>
                  <h3 className='mb-2 text-lg font-semibold text-blue-600'>
                    {bookAuthor.book.title}
                  </h3>

                  <div className='mb-2 text-sm text-gray-600'>
                    <div>Mã sách: {bookAuthor.book.code}</div>
                    <div>
                      Xuất bản: {formateDateVi(bookAuthor.book.publicationDate)}
                    </div>
                    <div>Giá: {formatPrice(bookAuthor.book.price)}</div>
                    <div>Trạng thái: {bookAuthor.book.status}</div>
                  </div>

                  <p className='line-clamp-3 text-sm text-gray-700'>
                    {bookAuthor.book.description}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-500'>Không có tác phẩm nào được tìm thấy.</p>
        )}
      </div>
    </div>
  );
};

export default AuthorInfo;
