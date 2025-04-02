import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/auth-context';
import QueryProvider from '@/providers/query-provider';
import { ConfigProvider } from 'antd';
import locale from 'antd/locale/vi_VN';
import type { ReactNode } from 'react';

type Props = {
  readonly children: ReactNode;
};

const Provider = ({ children }: Props) => {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <ConfigProvider locale={locale}>{children}</ConfigProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
};

export default Provider;
