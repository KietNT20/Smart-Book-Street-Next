import { AppSidebar } from '@/components/app-sidebar';
import { ModeToggle } from '@/components/model-toggle';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import BreadcrumbComp from './_components/breadcrumb-comp';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col">
            <header className="flex h-16 shrink-0 items-center border-b border-border px-4">
              <div className="flex flex-1 items-center gap-4">
                <SidebarTrigger className="-ml-2 h-8 w-8" />
                <Separator orientation="vertical" className="h-6" />

                <BreadcrumbComp />

                <div className="ml-auto flex items-center gap-4">
                  <ModeToggle />
                </div>
              </div>
            </header>
            <main className="px-0 py-2 sm:px-6 sm:py-4">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
