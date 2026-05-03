"use client";

import { useAuth } from "@/contexts/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Package, 
  Loader2,
  Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const providerSidebarItems = [
  { title: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
  { title: "Manage Menu", href: "/provider/menu", icon: UtensilsCrossed },
  { title: "Orders", href: "/provider/orders", icon: Package },
  { title: "Store Setup", href: "/provider/setup", icon: Settings },
];

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isProvider, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !isProvider) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This area is restricted to Restaurant Providers only.
            </p>
            <Button asChild className="w-full h-12">
              <Link href="/login">Sign In as Provider</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout title="Provider Portal" sidebarItems={providerSidebarItems}>
      {children}
    </DashboardLayout>
  );
}
