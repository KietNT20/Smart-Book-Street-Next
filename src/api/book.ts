import { API_URL } from '@/constant/api-url';
import { BASE_URL } from '@/constant/environment';
import { Book, BookNextjs } from '@/types/book-types';

export const fetchBookByISBN = async (
  isbn: string
): Promise<{ result: Book }> => {
  try {
    const response = await fetch(
      `${BASE_URL}/${API_URL.BOOKS.INDEX}/google/${isbn}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Không tìm thấy thông tin sách với mã ISBN này');
      }
      throw new Error('Có lỗi xảy ra khi tìm kiếm sách');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching book data:', error);
    throw error;
  }
};

export async function fetchBookIsbnInventory(
  storeId: string,
  isbn: string
): Promise<BookNextjs> {
  try {
    const response = await fetch(`/api/stores/${storeId}/books/${isbn}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Không thể lấy thông tin sách');
    }

    const bookData: BookNextjs = await response.json();
    return bookData;
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
    throw error;
  }
}
