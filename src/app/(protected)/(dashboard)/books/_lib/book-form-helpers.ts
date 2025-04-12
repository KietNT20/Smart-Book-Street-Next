import { Language } from '@/enums/lang';
import { BookFormValues } from '@/lib/zod';
import { BookAuthorIds, BookCategoryIds } from '@/types/book-types';
import dayjs from 'dayjs';

interface BookWithRelations extends BookFormValues {
  bookAuthors?: BookAuthorIds[];
  bookCategories?: BookCategoryIds[];
}

export function detectDateFormat(dateString: string): string {
  if (/^\d{4}$/.test(dateString)) {
    return 'YYYY';
  } else if (/^\d{4}-\d{2}$/.test(dateString)) {
    return 'YYYY-MM';
  } else {
    return 'YYYY-MM-DD';
  }
}

export function prepareInitialBookData(book?: BookFormValues): BookFormValues {
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
    if (
      /^\d{4}$/.test(book.publicationDate) ||
      /^\d{4}-\d{2}$/.test(book.publicationDate) ||
      /^\d{4}-\d{2}-\d{2}$/.test(book.publicationDate)
    ) {
      formattedDate = book.publicationDate;
    } else {
      try {
        const dateObj = dayjs(new Date(book.publicationDate));
        if (dateObj.isValid()) {
          formattedDate = dateObj.format('YYYY-MM-DD');
        }
      } catch (error) {
        console.error('Error formatting date:', error);
        formattedDate = '';
      }
    }
  }

  return {
    isbn: book.isbn || '',
    title: book.title || '',
    publicationDate: formattedDate,
    price: book.price || 0,
    languages: book.languages || '',
    description: book.description || '',
    size: book.size || '',
    status: book.status || '',
    publisherId: book.publisherId || '',
    authorIds:
      (book as BookWithRelations).bookAuthors?.map((ba) => ba.authorId) || [],
    categoryIds:
      (book as BookWithRelations).bookCategories?.map((bc) => bc.categoryId) ||
      [],
    mainImageFile: undefined,
    additionalImageFiles: [],
  };
}

// Hàm để sanitize HTML (nếu cần)
export const sanitizeHtml = (html: string): string => {
  // Bạn có thể sử dụng thư viện như DOMPurify để sanitize HTML
  // Đây là một triển khai đơn giản
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '');
};
