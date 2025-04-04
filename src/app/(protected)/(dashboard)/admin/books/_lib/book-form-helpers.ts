import { BookFormValues } from '@/lib/zod';
import { BookAuthorIds, BookCategoryIds } from '@/types/book-types';
import dayjs from 'dayjs';

interface BookWithRelations extends BookFormValues {
  bookAuthors?: BookAuthorIds[];
  bookCategories?: BookCategoryIds[];
}

// Hàm để phát hiện định dạng ngày
export function detectDateFormat(dateString: string): string {
  if (/^\d{4}$/.test(dateString)) {
    return 'YYYY'; // Chỉ có năm
  } else if (/^\d{4}-\d{2}$/.test(dateString)) {
    return 'YYYY-MM'; // Có tháng và năm
  } else {
    return 'YYYY-MM-DD'; // Mặc định định dạng đầy đủ
  }
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
      additionalImageFiles: []
    };
  }

  // Xử lý ngày xuất bản - giữ nguyên định dạng gốc nếu có thể
  let formattedDate = '';
  if (book.publicationDate) {
    // Kiểm tra xem dữ liệu đã ở dạng chuỗi với định dạng YYYY, YYYY-MM, YYYY-MM-DD chưa
    if (
      /^\d{4}$/.test(book.publicationDate) ||
      /^\d{4}-\d{2}$/.test(book.publicationDate) ||
      /^\d{4}-\d{2}-\d{2}$/.test(book.publicationDate)
    ) {
      // Nếu đã là chuỗi với định dạng hợp lệ, giữ nguyên
      formattedDate = book.publicationDate;
    } else {
      // Nếu là Date object hoặc chuỗi ngày khác, thì chuyển đổi
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
    code: book.code || '',
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
    additionalImageFiles: []
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
