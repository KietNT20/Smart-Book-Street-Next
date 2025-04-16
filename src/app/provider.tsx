import { ThemeProvider } from '@/components/theme-provider';
import QueryProvider from '@/providers/query-provider';
import StoreProvider from '@/providers/store-provider';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import type { ReactNode } from 'react';

type Props = {
  readonly children: ReactNode;
};

const Provider = ({ children }: Props) => {
  return (
    <AntdRegistry>
      <QueryProvider>
        <StoreProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </StoreProvider>
      </QueryProvider>
    </AntdRegistry>
  );
};

export default Provider;
