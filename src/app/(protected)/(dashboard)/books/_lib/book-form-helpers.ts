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
    languages: book.languages || Language.VIETNAMESE,
    description: book.description || '',
    size: book.size || '',
    status: book.status || '',
    publisherId: book.id ? book.publisher?.id : '',
    authorIds: book.id
      ? book.bookAuthors?.map((author) => author.authorId)
      : [],
    categoryIds: book.id
      ? book.bookCategories?.map((category) => category.categoryId)
      : [],
    mainImageFile: book.images?.[0]?.url || undefined,
    additionalImageFiles: [],
  };
}
