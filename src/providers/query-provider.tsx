'use client';

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider } from 'antd';
import locale from 'antd/locale/vi_VN';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function QueryProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={locale}
        theme={{
          components: {
            DatePicker: {
              colorPrimary: 'hsl(var(--primary))',
              colorBgContainer: 'hsl(var(--background))',
              colorBgElevated: 'hsl(var(--background))',
              colorBorder: 'hsl(var(--primary))',
              colorIcon: 'hsl(var(--darker))',
              colorIconHover: 'hsl(var(--primary))',
              cellHoverBg: 'hsl(var(--darker)/0.1)',
              colorTextPlaceholder: 'hsl(var(--muted-foreground)/0.5)',
              // colorTextLightSolid: 'hsl(var(--darker-foreground))',
              colorText: 'hsl(var(--text))',
              colorTextHeading: 'hsl(var(--text))',
              cellActiveWithRangeBg: 'hsl(var(--darker)/0.1)',
              colorSplit: 'hsl(var(--primary))',
              colorTextDisabled: 'hsl(var(--muted-foreground)/0.5)',
            },
            Calendar: {
              colorPrimary: 'hsl(var(--primary))',
              controlItemBgHover: 'hsl(var(--darker)/0.1)',
              colorBgContainer: 'hsl(var(--background))',
              colorText: 'hsl(var(--text))',
              itemActiveBg: 'hsl(var(--primary)/0.1)',
              colorTextTertiary: 'hsl(var(--secondary))',
              colorTextDisabled: 'hsl(var(--muted-foreground)/0.5)',
            },
            Select: {
              colorPrimary: 'hsl(var(--primary))',
              colorBgContainer: 'hsl(var(--background))',
              colorBgElevated: 'hsl(var(--sidebar-background))',
              colorText: 'hsl(var(--text))',
              colorBorder: 'hsl(var(--primary))',
              colorTextPlaceholder: 'hsl(var(--muted-foreground)/0.5)',
              colorTextSecondary: 'hsl(var(--muted-foreground)/0.5)',
              colorTextHeading: 'hsl(var(--text))',
              optionSelectedBg: 'hsl(var(--primary))',
            },
            Radio: {
              colorPrimary: 'hsl(var(--primary))',
              colorBgContainer: 'hsl(var(--background))',
              colorPrimaryActive: 'hsl(var(--foreground))',
              colorBorder: 'hsl(var(--primary))',
              colorText: 'hsl(var(--text))',
              colorBgTextHover: 'hsl(var(--background))',
              buttonBg: 'hsl(var(--background))',
              buttonSolidCheckedHoverBg: 'hsl(var(--primary))',
              buttonSolidCheckedColor: 'hsl(var(--text))',
            },
            Badge: {
              colorText: 'hsl(var(--matcha))',
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
