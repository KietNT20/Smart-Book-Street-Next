import { STORAGE } from '@/constant/storage';
import { PaymentMethod } from '@/enums/enums';
import { useCreateOrder } from '@/hooks/use-order';
import {
  useOrderDetailCarts,
  useOrderDetailMutation,
} from '@/hooks/use-order-detail';
import { getLocalStorageItem } from '@/utils/token';
import { useState } from 'react';
import { toast } from 'sonner';

export const useOrderDetail = () => {
  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);
  const { orderDetailCarts } = useOrderDetailCarts(storeId);
  const { updateOrderDetail, deleteOrderDetail } = useOrderDetailMutation();
  const { createOrder, createOrderPending } = useCreateOrder();

  // State để quản lý số lượng sản phẩm tạm thời
  const [quantities, setQuantities] = useState<{
    [key: string]: number | string;
  }>({});

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );

  const totalAmount =
    orderDetailCarts?.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0) || 0;

  const handleCreateOrder = () => {
    if (!paymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return;
    }

    const formData = new FormData();
    formData.append('StoreId', storeId);
    formData.append('PaymentMethod', paymentMethod);

    toast.promise(createOrder(formData), {
      loading: 'Đang tạo đơn hàng...',
      success: 'Tạo đơn hàng thành công',
      error: 'Tạo đơn hàng thất bại',
    });
  };

  // Hàm lấy số lượng hiện tại (từ state hoặc từ dữ liệu ban đầu)
  const getCurrentQuantity = (id: string, defaultQuantity: number) => {
    if (!(id in quantities)) {
      return defaultQuantity;
    }

    // Nếu là chuỗi rỗng thì hiển thị rỗng (đang nhập)
    if (quantities[id] === '') {
      return '';
    }

    // Trường hợp khác trả về số
    return quantities[id] as number;
  };

  const handleIncrement = (id: string, currentQuantity: number | string) => {
    // Chuyển đổi về số nếu là chuỗi rỗng hoặc số
    const numQuantity = currentQuantity === '' ? 0 : Number(currentQuantity);
    const newQuantity = numQuantity + 1;

    // Lưu giá trị gốc trước khi cập nhật
    const originalValue =
      orderDetailCarts?.find((item) => item.id === id)?.quantity || 1;

    setQuantities({
      ...quantities,
      [id]: newQuantity,
    });

    handleUpdateQuantity(id, newQuantity, originalValue);
  };

  const handleDecrement = (id: string, currentQuantity: number | string) => {
    // Chuyển đổi về số nếu là chuỗi rỗng hoặc số
    const numQuantity = currentQuantity === '' ? 2 : Number(currentQuantity);

    if (numQuantity > 1) {
      const newQuantity = numQuantity - 1;

      // Lưu giá trị gốc trước khi cập nhật
      const originalValue =
        orderDetailCarts?.find((item) => item.id === id)?.quantity || 1;

      setQuantities({
        ...quantities,
        [id]: newQuantity,
      });

      handleUpdateQuantity(id, newQuantity, originalValue);
    }
  };

  // Hàm xử lý khi người dùng nhập vào input
  const handleQuantityChange = (id: string, value: string) => {
    // Chỉ cho phép nhập số
    const cleanedValue = value.replace(/[^0-9]/g, '');

    // Cho phép giá trị trống trong quá trình nhập
    if (cleanedValue === '') {
      setQuantities({
        ...quantities,
        [id]: '',
      });
      return;
    }

    const numValue = parseInt(cleanedValue);
    if (!isNaN(numValue)) {
      setQuantities({
        ...quantities,
        [id]: numValue === 0 ? 0 : numValue, // Cho phép giá trị 0 trong quá trình nhập
      });
    }
  };

  const handleQuantityBlur = (
    id: string,
    value: string,
    defaultQuantity: number
  ) => {
    // Xử lý khi input rỗng hoặc giá trị bằng 0
    if (value === '' || value === '0') {
      // Reset về giá trị 1 khi out focus
      setQuantities({
        ...quantities,
        [id]: 1,
      });
      // Lấy giá trị gốc
      const originalValue =
        orderDetailCarts?.find((item) => item.id === id)?.quantity || 1;
      // Cập nhật API với số lượng là 1
      handleUpdateQuantity(id, 1, originalValue);
      return;
    }

    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1) {
      // Nếu giá trị không hợp lệ, reset về giá trị trước đó
      setQuantities({
        ...quantities,
        [id]: defaultQuantity,
      });
      return;
    }

    // Lấy giá trị gốc
    const originalValue =
      orderDetailCarts?.find((item) => item.id === id)?.quantity || 1;
    // Gọi API cập nhật số lượng
    handleUpdateQuantity(id, numValue, originalValue);
  };

  // Hàm xử lý phím tắt
  const handleQuantityKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    currentQuantity: number | string
  ) => {
    // Xử lý phím tăng/giảm
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement(id, currentQuantity);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement(id, currentQuantity);
    } else if (e.key === 'Enter') {
      e.currentTarget.blur(); // Khi nhấn Enter sẽ mất focus để trigger onBlur
    }
  };

  // Hàm cập nhật số lượng sản phẩm
  const handleUpdateQuantity = (
    id: string,
    quantity: number,
    originalQuantity?: number
  ) => {
    toast.promise(
      updateOrderDetail({ id, quantity }).catch((error) => {
        // Khi có lỗi, reset về giá trị ban đầu nếu có
        if (originalQuantity !== undefined) {
          setQuantities({
            ...quantities,
            [id]: originalQuantity,
          });
        }
        throw error;
      }),
      {
        loading: 'Đang cập nhật số lượng...',
        success: 'Cập nhật số lượng thành công',
        error: 'Số lượng vượt quá hàng tồn kho',
      }
    );
  };

  const handleDelete = (id: string) => {
    toast.promise(deleteOrderDetail(id), {
      loading: 'Đang xóa sản phẩm...',
      success: 'Xóa sản phẩm thành công',
      error: 'Xóa sản phẩm thất bại',
    });
  };

  return {
    orderDetailCarts,
    totalAmount,
    handleIncrement,
    handleDecrement,
    handleQuantityChange,
    handleQuantityBlur,
    handleQuantityKeyDown,
    handleDelete,
    getCurrentQuantity,
    handleCreateOrder,
    handleUpdateQuantity,
    setPaymentMethod,
    createOrderPending,
    paymentMethod,
  };
};
