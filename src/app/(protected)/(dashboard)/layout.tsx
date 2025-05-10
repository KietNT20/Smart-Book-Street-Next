import { AppSidebar } from '@/components/app-sidebar';
import BreadcrumbPath from '@/components/breadcrumb/breadcrumb-path';
import { ModeToggle } from '@/components/model-toggle';
import PaymentRedirectHandler from '@/components/payment-redirect-handler';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { BreadcrumbProvider } from '@/context/breadcrumb-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <PaymentRedirectHandler />
      <div className='flex min-h-screen w-full bg-background'>
        <AppSidebar />
        <SidebarInset>
          <BreadcrumbProvider>
            <div className='flex flex-1 flex-col'>
              <header className='flex h-16 shrink-0 items-center border-b border-border px-4'>
                <div className='flex flex-1 items-center gap-4'>
                  <SidebarTrigger className='-ml-2 h-8 w-8' />
                  <Separator orientation='vertical' className='h-6' />
                  <BreadcrumbPath />
                  <div className='ml-auto flex items-center gap-4'>
                    <ModeToggle />
                  </div>
                </div>
              </header>
              <main className='overflow-x-auto p-2'>{children}</main>
            </div>
          </BreadcrumbProvider>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
