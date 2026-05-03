"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LucideIcon, 
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  title: string;
}

export function DashboardLayout({ children, sidebarItems, title }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-4 py-4">
      <div className="px-6 pb-4">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-80px)] px-4 py-8 md:gap-8">
      {/* Mobile Sidebar Trigger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-[100px] z-40 md:hidden h-10 w-10 bg-background"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Dashboard Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col rounded-xl border bg-card shadow-sm md:flex">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="rounded-xl border bg-card p-6 shadow-sm min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
