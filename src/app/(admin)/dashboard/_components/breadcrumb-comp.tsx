'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { PATH } from '@/enums/path';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const BreadcrumbComp = () => {
  const pathname = usePathname();

  const segments = pathname
    .split('/')
    .filter((segment) => segment !== '')
    .map((segment, index, array) => {
      const href = '/' + array.slice(0, index + 1).join('/');
      return {
        label:
          segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        href: href
      };
    });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className='hidden md:block'>
          <BreadcrumbLink asChild>
            <Link href={PATH.HOME}>Home</Link>
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

export default BreadcrumbComp;
