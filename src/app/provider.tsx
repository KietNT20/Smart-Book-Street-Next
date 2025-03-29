import { ThemeProvider } from '@/components/theme-provider';
import QueryProvider from '@/providers/QueryProvider';
import type { ReactNode } from 'react';

type Props = {
  readonly children: ReactNode;
};

const Provider = ({ children }: Props) => {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryProvider>
  );
};

export default Provider;
