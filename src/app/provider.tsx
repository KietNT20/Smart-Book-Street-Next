import { ThemeProvider } from '@/components/theme-provider';
import QueryProvider from '@/providers/query-provider';
import StoreProvider from '@/providers/store-provider';
import { ConfigProvider } from 'antd';
import locale from 'antd/locale/vi_VN';
import type { ReactNode } from 'react';

type Props = {
  readonly children: ReactNode;
};

const Provider = ({ children }: Props) => {
  return (
    <StoreProvider>
      <QueryProvider>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <ConfigProvider locale={locale}>{children}</ConfigProvider>
        </ThemeProvider>
      </QueryProvider>
    </StoreProvider>
  );
};

export default Provider;
