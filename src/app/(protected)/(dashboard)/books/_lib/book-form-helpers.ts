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

  const formattedDate = '';
  if (book.publicationDate) {
    const dateStr =
      typeof book.publicationDate === 'string'
        ? book.publicationDate
        : dayjs(book.publicationDate).format('YYYY-MM-DD');

    if (
      /^\d{4}$/.test(dateStr) ||
      /^\d{4}-\d{2}$/.test(dateStr) ||
      /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
    ) {
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
      authorIds: book.bookAuthors.map((author) => author.authorId) || [],
      categoryIds:
        book.bookCategories.map((category) => category.categoryId) || [],
      mainImageFile: undefined,
      additionalImageFiles: [],
    };
  }
}
// Hàm để sanitize HTML (nếu cần)
export const sanitizeHtml = (html: string): string => {
  // Bạn có thể sử dụng thư viện như DOMPurify để sanitize HTML
  // Đây là một triển khai đơn giản
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '');
};
