import { ImageFallback } from '@/constant/storage';
import { formatDateVi, formatPrice } from '@/lib/utils';
import { Author } from '@/types/author-types';
import DOMPurify from 'dompurify';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  author: Author;
};

const AuthorInfo = ({ author }: Props) => {
  return (
    <div className='overflow-hidden rounded-lg bg-background shadow-lg'>
      {/* Header với thông tin cơ bản */}
      <div className='md:flex'>
        <div className='flex items-center justify-center p-6 md:w-1/3'>
          <Image
            src={`${author.baseImgUrl || ImageFallback.SRC}`}
            alt={author.authorName}
            width={500}
            height={500}
          />
        </div>

        <div className='p-6 md:w-2/3'>
          <h1 className='mb-4 text-3xl font-bold'>{author.authorName}</h1>

          <div className='mb-6'>
            <div className='mb-2 flex items-center'>
              <span className='w-32 text-lg font-bold'>Quốc tịch:</span>
              <span className='font-medium'>{author.nationality}</span>
            </div>

            <div className='mb-2 flex items-center'>
              <span className='w-32 text-lg font-bold'>Ngày sinh:</span>
              <span className='font-medium'>{formatDateVi(author.dob)}</span>
            </div>
          </div>

          <div className='mb-6'>
            <h2 className='mb-2 text-xl font-semibold'>Tiểu sử</h2>
            <p className='leading-relaxed text-muted-foreground'>
              {author.biography}
            </p>
          </div>
        </div>
      </div>

      {/* Danh sách tác phẩm */}
      <div className='border-t border-gray-200 p-6'>
        <h2 className='mb-4 text-2xl font-semibold'>Các Tác Phẩm</h2>

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

                  <div className='mb-2 text-sm'>
                    <div>Mã sách: {bookAuthor.book.isbn}</div>
                    <div>
                      Xuất bản: {formatDateVi(bookAuthor.book.publicationDate)}
                    </div>
                    <div>Giá: {formatPrice(bookAuthor.book.price)}</div>
                    <div>Trạng thái: {bookAuthor.book.status}</div>
                  </div>
                  <div
                    className='line-clamp-3 text-sm text-muted-foreground'
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(bookAuthor.book.description),
                    }}
                  ></div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-zinc-500'>Không có tác phẩm nào được tìm thấy.</p>
        )}
      </div>
    </div>
  );
};

export default AuthorInfo;
