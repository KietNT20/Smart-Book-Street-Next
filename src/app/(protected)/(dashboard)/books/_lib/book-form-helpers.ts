import { Language } from '@/enums/lang';
import { Book } from '@/types/book-types';
import dayjs from 'dayjs';

export function detectDateFormat(dateString: string): string {
  if (/^\d{4}$/.test(dateString)) {
    return 'YYYY';
  } else if (/^\d{4}-\d{2}$/.test(dateString)) {
    return 'YYYY-MM';
  } else {
    return 'YYYY-MM-DD';
  }
}

export function prepareInitialBookData(book?: Book) {
  console.log('book', book);
  if (!book) {
    return {
      isbn: '',
      title: '',
      publicationDate: '',
      price: 1000,
      languages: Language.VIETNAMESE,
      description: '',
      size: '',
      status: '',
      publisherId: '',
      authorIds: [],
      categoryIds: [],
      mainImageFile: undefined,
      additionalImageFiles: [],
    };
  }

  let formattedDate = '';
  if (book.publicationDate) {
    const date = dayjs(book.publicationDate);
    if (date.isValid()) {
      formattedDate = date.format('YYYY-MM-DD');
    }
  }

  return {
    isbn: book.isbn || '',
    title: book.title || '',
    publicationDate: formattedDate,
    price: book.price || 0,
    languages: book.languages,
    description: book.description || '',
    size: book.size || '',
    status: book.status || '',
    publisherId: book.publisherId || '',
    authorIds: book.bookAuthors?.map((author) => author.authorId) || [],
    categoryIds:
      book.bookCategories?.map((category) => category.categoryId) || [],
    mainImageFile: book.images?.[0]?.url || undefined,
    additionalImageFiles: [],
  };
}
