import { BookFormValues } from '@/lib/zod';
import { BookAuthorIds, BookCategoryIds } from '@/types/book-types';
import { format } from 'date-fns';

interface BookWithRelations extends BookFormValues {
  bookAuthors?: BookAuthorIds[];
  bookCategories?: BookCategoryIds[];
}

export function prepareInitialBookData(book?: BookFormValues): BookFormValues {
  if (!book) {
    return {
      code: '',
      title: '',
      publicationDate: '',
      price: 0,
      languages: '',
      description: '',
      size: '',
      status: '',
      publisherId: '',
      authorIds: [],
      categoryIds: [],
      mainImageFile: undefined,
      additionalImageFiles: [],
      createdDate: new Date()
    };
  }

  return {
    code: book.code || '',
    title: book.title || '',
    publicationDate: book.publicationDate
      ? format(new Date(book.publicationDate), 'yyyy-MM-dd')
      : '',
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
    lastUpdatedDate: new Date()
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
