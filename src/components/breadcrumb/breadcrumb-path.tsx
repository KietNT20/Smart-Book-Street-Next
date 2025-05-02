'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  ACTION_MAPPING,
  API_MAPPING,
  useBreadcrumb,
} from '@/context/breadcrumb-context';
import { PATH } from '@/enums/path';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const BreadcrumbPath = () => {
  const pathname = usePathname();
  const { labels } = useBreadcrumb();

  const isIdSegment = (segment: string): boolean => {
    return /^[0-9a-fA-F-]+$/.test(segment);
  };

  const segments = pathname
    .split('/')
    .filter((segment) => segment !== '')
    .map((segment, index, array) => {
      const href = '/' + array.slice(0, index + 1).join('/');

      if (labels[href]) {
        return {
          label: labels[href],
          href,
        };
      }

      if (isIdSegment(segment)) {
        const entityType = index > 0 ? array[index - 1] : '';
        const entityInfo = API_MAPPING[entityType];

        if (entityInfo) {
          return {
            label: `${entityInfo.singular} #${segment.substring(0, 4)}...`,
            href,
          };
        }

        return {
          label: `Chi tiết #${segment.substring(0, 4)}...`,
          href,
        };
      }

      if (ACTION_MAPPING[segment]) {
        return {
          label: ACTION_MAPPING[segment],
          href,
        };
      }

      if (API_MAPPING[segment]) {
        return {
          label: API_MAPPING[segment].plural,
          href,
        };
      }

      return {
        label:
          segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        href,
      };
    });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className='hidden md:block'>
          <BreadcrumbLink asChild>
            <Link href={PATH.HOME}>Trang chủ</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => (
          <React.Fragment key={segment.href}>
            <BreadcrumbSeparator className='hidden md:block' />
            <BreadcrumbItem>
              {index === segments.length - 1 ? (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={segment.href}>{segment.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbPath;
