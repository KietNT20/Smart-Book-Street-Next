'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

export const API_MAPPING: Record<string, { singular: string; plural: string }> =
  {
    publishers: { singular: 'Nhà xuất bản', plural: 'Nhà xuất bản' },
    stores: { singular: 'Cửa hàng', plural: 'Cửa hàng' },
    users: { singular: 'Người dùng', plural: 'Người dùng' },
    events: { singular: 'Sự kiện', plural: 'Sự kiện' },
    zones: { singular: 'Khu vực', plural: 'Khu vực' },
    books: { singular: 'Sách', plural: 'Sách' },
    authors: { singular: 'Tác giả', plural: 'Tác giả' },
    categories: { singular: 'Danh mục', plural: 'Danh mục' },
    orders: { singular: 'Đơn hàng', plural: 'Đơn hàng' },
    inventories: { singular: 'Kho hàng', plural: 'Kho hàng' },
    userstores: {
      singular: 'Cửa hàng của người dùng',
      plural: 'Cửa hàng của người dùng',
    },
    'store-schedules': {
      singular: 'Lịch làm việc của cửa hàng',
      plural: 'Lịch làm việc của cửa hàng',
    },
    inventory: {
      singular: 'Kho hàng',
      plural: 'Kho hàng',
    },
    souvenirs: {
      singular: 'Đồ lưu niệm',
      plural: 'Đồ lưu niệm',
    },
    'event-date': {
      singular: 'Sự kiện hôm nay',
      plural: 'Sự kiện hôm nay',
    },
  };

export const ACTION_MAPPING: Record<string, string> = {
  create: 'Thêm mới',
  edit: 'Chỉnh sửa',
  detail: 'Chi tiết',
  registered: 'Đã đăng ký',
};

interface BreadcrumbLabels {
  [path: string]: string;
}

interface BreadcrumbContextType {
  labels: BreadcrumbLabels;
  setLabel: (path: string, label: string) => void;
  removeLabel: (path: string) => void;
  clearLabels: () => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  labels: {},
  setLabel: () => {},
  removeLabel: () => {},
  clearLabels: () => {},
});

export const useBreadcrumb = () => useContext(BreadcrumbContext);

interface BreadcrumbProviderProps {
  children: ReactNode;
}

export const BreadcrumbProvider = ({ children }: BreadcrumbProviderProps) => {
  const [labels, setLabels] = useState<BreadcrumbLabels>({});

  const setLabel = useCallback((path: string, label: string) => {
    setLabels((prevLabels) => ({
      ...prevLabels,
      [path]: label,
    }));
  }, []);

  const removeLabel = useCallback((path: string) => {
    setLabels((prevLabels) => {
      const newLabels = { ...prevLabels };
      delete newLabels[path];
      return newLabels;
    });
  }, []);

  const clearLabels = useCallback(() => {
    setLabels({});
  }, []);

  return (
    <BreadcrumbContext.Provider
      value={{
        labels,
        setLabel,
        removeLabel,
        clearLabels,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};
