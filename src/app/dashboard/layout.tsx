// app/dashboard/layout.tsx
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/model-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col flex-1">
            <header className="flex h-16 shrink-0 items-center border-b border-border px-4">
              <div className="flex flex-1 items-center gap-4">
                <SidebarTrigger className="-ml-2 h-8 w-8" />
                <Separator orientation="vertical" className="h-6" />

                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        Building Your Application
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                <div className="ml-auto flex items-center gap-4">
                  <ModeToggle />
                </div>
              </div>
            </header>
            <main className="p-4">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
