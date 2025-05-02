import { useBreadcrumb } from '@/context/breadcrumb-context';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface BreadcrumbLabel {
  path: string;
  label: string;
}

/**
 *
 * @param labels Array of objects containing path and label for breadcrumb
 * @returns {void}
 * @example
 * useBreadcrumbPage([
 *   { path: '/home', label: 'Home' },
 *   { path: '/about', label: 'About' },
 * ]);
 */
export const useBreadcrumbPage = (labels: BreadcrumbLabel[]): void => {
  const { setLabel, removeLabel } = useBreadcrumb();

  useEffect(() => {
    // Set up all labels
    labels.forEach(({ path, label }) => {
      if (label) {
        setLabel(path, label);
      }
    });

    // Cleanup when component unmounts
    return () => {
      labels.forEach(({ path }) => {
        removeLabel(path);
      });
    };
  }, [labels, setLabel, removeLabel]);
};

/**
 *
 * @param basePath Path (PATH.PUBLISHERS)
 * @param baseLabel Label ('Nhà xuất bản')
 * @param id Entity ID
 * @param entityName Name of the entity (e.g., 'Nhà xuất bản ABC')
 * @param isEditPage Optional flag to indicate if currently on edit page
 */
export const useEntityBreadcrumb = (
  basePath: string,
  baseLabel: string,
  id: string,
  entityName: string | null | undefined,
  isEditPage?: boolean
) => {
  const { setLabel, removeLabel } = useBreadcrumb();
  const pathname = usePathname();

  // Detect if we're on the edit page
  const isOnEditPage = isEditPage || (pathname && pathname.includes('/edit'));

  useEffect(() => {
    // Always set breadcrumb for list page
    setLabel(basePath, baseLabel);

    // If entity data is available
    if (entityName) {
      // Always set breadcrumb for detail page, even if we're on edit page
      // This ensures the breadcrumb trail is complete
      setLabel(`${basePath}/${id}`, entityName);

      // Set breadcrumb for edit page
      if (isOnEditPage) {
        setLabel(`${basePath}/${id}/edit`, `Chỉnh sửa ${entityName}`);
      }
    } else if (isOnEditPage) {
      // Fallback for edit page when entity name isn't available yet
      // This provides at least some context until data loads
      setLabel(`${basePath}/${id}`, `Chi tiết`);
      setLabel(`${basePath}/${id}/edit`, `Chỉnh sửa`);
    }

    // Cleanup when component unmounts
    return () => {
      removeLabel(basePath);
      removeLabel(`${basePath}/${id}`);
      removeLabel(`${basePath}/${id}/edit`);
    };
  }, [
    basePath,
    baseLabel,
    id,
    entityName,
    isOnEditPage,
    setLabel,
    removeLabel,
  ]);
};

/**
 * Specialized hook for create pages
 *
 * @param basePath Path (PATH.PUBLISHERS)
 * @param baseLabel Label ('Nhà xuất bản')
 * @param createPath Path for create page (PATH.PUBLISHER_CREATE)
 * @param createLabel Label for create page ('Thêm mới')
 */
export const useCreatePageBreadcrumb = (
  basePath: string,
  baseLabel: string,
  createPath: string,
  createLabel: string = 'Thêm mới'
) => {
  const { setLabel, removeLabel } = useBreadcrumb();

  useEffect(() => {
    // Set breadcrumbs for both the list and create page
    setLabel(basePath, baseLabel);
    setLabel(createPath, createLabel);

    // Cleanup when component unmounts
    return () => {
      removeLabel(basePath);
      removeLabel(createPath);
    };
  }, [basePath, baseLabel, createPath, createLabel, setLabel, removeLabel]);
};
