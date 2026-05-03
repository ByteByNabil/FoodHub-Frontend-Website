"use client";

import { useAuth } from "@/contexts/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Tag, 
  Store,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const adminSidebarItems = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Manage Users", href: "/admin/users", icon: Users },
  { title: "All Orders", href: "/admin/orders", icon: Package },
  { title: "Restaurants", href: "/admin/providers", icon: Store },
  { title: "Categories", href: "/admin/categories", icon: Tag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This area is restricted to administrators only.
            </p>
            <Button asChild className="w-full h-12">
              <Link href="/login">Sign In as Admin</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout title="Admin Area" sidebarItems={adminSidebarItems}>
      {children}
    </DashboardLayout>
  );
}
