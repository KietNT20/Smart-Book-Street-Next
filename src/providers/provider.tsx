'use client';

import { ThemeProvider } from '@/components/theme-provider';
import React from 'react';
import NextAuthProvider from './NextAuthProvider';
import QueryProvider from './QueryProvider';

const Provider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <QueryProvider>
      <NextAuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </NextAuthProvider>
    </QueryProvider>
  );
};

export default Provider;
