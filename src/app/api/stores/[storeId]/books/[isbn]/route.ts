import { inventoryService } from '@/services/inventoryService';
import { BookNextjs } from '@/types/book-types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: { storeId: string; isbn: string } }
) {
  try {
    const { storeId, isbn } = params;

    if (!storeId) {
      return NextResponse.json(
        { error: 'Yêu cầu chọn thông tin cửa hàng' },
        { status: 400 }
      );
    }

    if (!isbn) {
      return NextResponse.json(
        { error: 'Yêu cầu cung cấp ISBN của sách' },
        { status: 400 }
      );
    }

    const inventoriesResponse =
      await inventoryService.getBookByStoreId(storeId);

    // Find ISBN in inventory of store
    const inventoryWithBook = inventoriesResponse.results.find(
      (inventory) => inventory.book && inventory.book.isbn === isbn
    );

    if (!inventoryWithBook || !inventoryWithBook.book) {
      return NextResponse.json(
        { error: 'Không tìm thấy sách với ISBN này trong cửa hàng' },
        { status: 404 }
      );
    }

    const book: BookNextjs = {
      ...inventoryWithBook.book,
      entityId: inventoryWithBook.entityId,
      inventoryId: inventoryWithBook.id,
      quantity: inventoryWithBook.quantity,
      isInStock: inventoryWithBook.isInStock,
    };

    return NextResponse.json(book);
  } catch (error: any) {
    console.error('Error fetching book by ISBN:', error);
    return NextResponse.json(
      { error: error.message || 'Không thể lấy thông tin sách' },
      { status: 500 }
    );
  }
}
