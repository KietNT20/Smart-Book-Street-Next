import { STORAGE } from '@/constant/storage';
import { PaymentMethod } from '@/enums/enums';
import { useCreateOrder } from '@/hooks/use-order';
import {
  useOrderDetailCarts,
  useOrderDetailMutation,
} from '@/hooks/use-order-detail';
import tokenMethod, {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@/utils/token';
import { useState } from 'react';
import { toast } from 'sonner';

export const useOrderPage = () => {
  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);
  const { orderDetailCarts } = useOrderDetailCarts();
  const { updateOrderDetail, deleteOrderDetail } = useOrderDetailMutation();
  const { createOrder, createOrderPending } = useCreateOrder();

  // State for managing quantities of products in the cart
  // This state is used to store the quantities of products that are being updated
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
    formData.set('StoreId', storeId);
    formData.set('PaymentMethod', paymentMethod);

    toast.promise(createOrder(formData), {
      loading: 'Đang tạo đơn hàng...',
      success: (data) => {
        const { paymentLink } = data.result;
        const message = 'Tạo đơn hàng thành công';

        switch (paymentMethod) {
          case PaymentMethod.TRANSFER:
            if (paymentLink) {
              const currentToken = tokenMethod.get();
              if (currentToken) {
                // Save the current token to localStorage
                setLocalStorageItem('savedPaymentToken', currentToken);
                // Mark the payment as in progress
                setLocalStorageItem('paymentInProgress', true);
              }
              window.open(paymentLink, '_blank');
            } else {
              toast.error('Đơn hàng không có liên kết thanh toán');
            }
            break;

          case PaymentMethod.CASH:
            toast.success(message);
            break;

          default:
            // Handle any other payment methods if needed
            toast.success(message);
            break;
        }

        return message;
      },
      error: 'Tạo đơn hàng thất bại',
    });
  };

  // This function is used to get the current quantity of a product in the cart or a default value if it doesn't exist in the quantities state
  const getCurrentQuantity = (id: string, defaultQuantity: number) => {
    if (!(id in quantities)) {
      return defaultQuantity;
    }

    // If the quantity is an empty string, return an empty string (to indicate that the input is empty)
    if (quantities[id] === '') {
      return '';
    }

    // Otherwise, return the quantity as a number
    return quantities[id] as number;
  };

  const handleIncrement = (id: string, currentQuantity: number | string) => {
    // Convert the current quantity to a number, defaulting to 0 if it's an empty string
    const numQuantity = currentQuantity === '' ? 0 : Number(currentQuantity);
    const newQuantity = numQuantity + 1;

    // Save the original value before updating
    const originalValue =
      orderDetailCarts?.find((item) => item.id === id)?.quantity || 1;

    setQuantities({
      ...quantities,
      [id]: newQuantity,
    });

    handleUpdateQuantity(id, newQuantity, originalValue);
  };

  const handleDecrement = (id: string, currentQuantity: number | string) => {
    // Convert the current quantity to a number, defaulting to 0 if it's an empty string
    const numQuantity = currentQuantity === '' ? 2 : Number(currentQuantity);

    if (numQuantity > 1) {
      const newQuantity = numQuantity - 1;

      // Save the original value before updating
      const originalValue =
        orderDetailCarts?.find((item) => item.id === id)?.quantity || 1;

      setQuantities({
        ...quantities,
        [id]: newQuantity,
      });

      handleUpdateQuantity(id, newQuantity, originalValue);
    }
  };

  // This function is used when the user types in the input field for quantity
  const handleQuantityChange = (id: string, value: string) => {
    // Remove all non-numeric characters from the input value
    const cleanedValue = value.replace(/[^0-9]/g, '');

    // Allow empty value during input
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
        [id]: numValue === 0 ? 0 : numValue, // Allow value 0 during input
      });
    }
  };

  const handleQuantityBlur = (
    id: string,
    value: string,
    defaultQuantity: number
  ) => {
    // Handle when input is empty or value is 0
    if (value === '' || value === '0') {
      // Reset to value 1 when out of focus
      setQuantities({
        ...quantities,
        [id]: 1,
      });
      // Get original value
      const originalValue =
        orderDetailCarts?.find((item) => item.id === id)?.quantity || 1;
      // Update API with value 1
      handleUpdateQuantity(id, 1, originalValue);
      return;
    }

    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1) {
      // If the value is invalid, reset to the previous value
      setQuantities({
        ...quantities,
        [id]: defaultQuantity,
      });
      return;
    }

    // Get original value
    const originalValue =
      orderDetailCarts?.find((item) => item.id === id)?.quantity || 1;
    // Update API with value
    handleUpdateQuantity(id, numValue, originalValue);
  };

  // Handle keyboard shortcuts
  const handleQuantityKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    currentQuantity: number | string
  ) => {
    // Handle increment/decrement keys
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement(id, currentQuantity);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement(id, currentQuantity);
    } else if (e.key === 'Enter') {
      e.currentTarget.blur(); // When pressing Enter, lose focus to trigger onBlur
    }
  };

  // Handle updating product quantity
  const handleUpdateQuantity = (
    id: string,
    quantity: number,
    originalQuantity?: number
  ) => {
    toast.promise(
      updateOrderDetail({ id, quantity }).catch((error) => {
        // When there is an error, reset to the original value if available
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
    deleteOrderDetail(id);
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
