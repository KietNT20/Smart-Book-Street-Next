import { STORAGE } from '@/constant/storage';
import { OrderStatus, PaymentMethod } from '@/enums/enums';
import useDebounce from '@/hooks/use-debounce';
import { OrderParamsResult } from '@/types/order-types';
import { useEffect, useRef, useState } from 'react';
import {
  FilterChangeFunction,
  FilterState,
  FilterValue,
  OrderFilterProps,
} from '../_components/order-filter';

const ALL_VALUE = 'all';

export const useOrderFilter = ({
  onFilterChange,
  initialStoreId,
}: OrderFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    storeId: initialStoreId || '',
    minAmount: '',
    maxAmount: '',
    paymentMethod: ALL_VALUE,
    status: ALL_VALUE,
    startDate: null,
    endDate: null,
  });

  const prevPropsRef = useRef<{
    onFilterChange?: FilterChangeFunction;
    initialStoreId?: string;
  }>({});

  useEffect(() => {
    prevPropsRef.current = { onFilterChange, initialStoreId };
  });

  const isFiltering =
    filters.minAmount !== '' ||
    filters.maxAmount !== '' ||
    filters.paymentMethod !== ALL_VALUE ||
    filters.status !== ALL_VALUE ||
    filters.startDate !== null ||
    filters.endDate !== null;

  useEffect(() => {
    if (initialStoreId !== prevPropsRef.current.initialStoreId) {
      if (initialStoreId) {
        setFilters((prev) => ({ ...prev, storeId: initialStoreId }));
      } else {
        const storedStoreId = localStorage.getItem(STORAGE.SELECTED_STORE_KEY);
        if (storedStoreId) {
          setFilters((prev) => ({ ...prev, storeId: storedStoreId }));
        }
      }
    }
  }, [initialStoreId]);

  const debouncedFilters = useDebounce(filters, 500);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const filterValues: OrderParamsResult = {
      storeId: debouncedFilters.storeId || '',
    };

    if (debouncedFilters.minAmount) {
      filterValues.minAmount = Number(debouncedFilters.minAmount);
    }

    if (debouncedFilters.maxAmount) {
      filterValues.maxAmount = Number(debouncedFilters.maxAmount);
    }

    if (
      debouncedFilters.paymentMethod &&
      debouncedFilters.paymentMethod !== ALL_VALUE
    ) {
      filterValues.paymentMethod =
        debouncedFilters.paymentMethod as PaymentMethod;
    }

    if (debouncedFilters.status && debouncedFilters.status !== ALL_VALUE) {
      filterValues.status = debouncedFilters.status as OrderStatus;
    }

    if (debouncedFilters.startDate) {
      filterValues.startDate = debouncedFilters.startDate.toDate();
    }

    if (debouncedFilters.endDate) {
      filterValues.endDate = debouncedFilters.endDate.toDate();
    }

    onFilterChange(filterValues);
  }, [debouncedFilters, onFilterChange]);

  const handleInputChange = <K extends keyof FilterState>(
    field: K,
    value: FilterValue<K>
  ): void => {
    if (
      (field === 'minAmount' || field === 'maxAmount') &&
      typeof value === 'string'
    ) {
      if (value === '') {
        setFilters((prev) => ({ ...prev, [field]: value }));
        return;
      }

      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        setFilters((prev) => ({ ...prev, [field]: value }));
      }
      return;
    }

    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearField = (field: keyof typeof filters): void => {
    if (field === 'startDate' || field === 'endDate') {
      setFilters((prev) => ({ ...prev, [field]: null }));
    } else if (field === 'paymentMethod' || field === 'status') {
      setFilters((prev) => ({ ...prev, [field]: ALL_VALUE }));
    } else {
      setFilters((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const clearAllFilters = (): void => {
    setFilters({
      storeId: filters.storeId,
      minAmount: '',
      maxAmount: '',
      paymentMethod: ALL_VALUE,
      status: ALL_VALUE,
      startDate: null,
      endDate: null,
    });
  };

  return {
    isOpen,
    setIsOpen,
    filters,
    handleInputChange,
    clearField,
    clearAllFilters,
    isFiltering,
  };
};
