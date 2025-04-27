'use client';

import { STORAGE } from '@/constant/storage';
import { OrderStatus, Sort } from '@/enums/enums';
import {
  useGetOrdersSearchPagination,
  useOrderStatusMuatation,
} from '@/hooks/use-order';
import { OrderParamsResult } from '@/types/order-types';
import { getLocalStorageItem } from '@/utils/token';
import { useCallback, useState } from 'react';

export const useOrderTable = () => {
  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY) || '';
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('createdDate');
  const [sortOrder, setSortOrder] = useState(Sort.DESC);
  const [filterValues, setFilterValues] = useState<OrderParamsResult>({
    storeId: storeId,
  });

  const { orders, ordersLoading, totalPage } = useGetOrdersSearchPagination({
    pageSize,
    pageNumber,
    sortField,
    sortOrder,
    result: filterValues,
  });

  const {
    updateOrderStatus,
    cancelOrderStatus,
    isOrderCancelPending,
    updateOrderStatusPending,
  } = useOrderStatusMuatation();

  const isSearching = Object.keys(filterValues).length > 1;

  const handleSort = useCallback(
    (field: string) => {
      if (sortField === field) {
        setSortOrder(sortOrder === Sort.ASC ? Sort.DESC : Sort.ASC);
      } else {
        setSortField(field);
        setSortOrder(Sort.ASC);
      }
      setPageNumber(1);
    },
    [sortField, sortOrder]
  );

  const handleFilterChange = useCallback(
    (newFilterValues: OrderParamsResult) => {
      setFilterValues(newFilterValues);
      setPageNumber(1);
    },
    []
  );

  const handlePageSizeChange = useCallback((value: string) => {
    setPageSize(Number(value));
    setPageNumber(1);
  }, []);

  const handleUpdateOrderStatus = (orderId: string) => {
    updateOrderStatus(orderId);
  };

  const handleCancelOrderStatus = (orderId: string) => {
    cancelOrderStatus(orderId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case OrderStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  return {
    orders,
    ordersLoading,
    totalPage,
    pageNumber,
    pageSize,
    sortField,
    sortOrder,
    isSearching,
    handleSort,
    handleFilterChange,
    handlePageSizeChange,
    handleUpdateOrderStatus,
    handleCancelOrderStatus,
    getStatusColor,
    setPageNumber,
    setPageSize,
    setSortField,
    setSortOrder,
    isOrderCancelPending,
    updateOrderStatusPending,
    storeId,
  };
};
