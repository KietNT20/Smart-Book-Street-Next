import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/auth-context';
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
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};

export default Provider;
