"use client";

import Link from "next/link";
import { Package, UtensilsCrossed, TrendingUp, Clock, Loader2, AlertCircle } from "lucide-react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import type { Order } from "@/lib/types";

export default function ProviderDashboardPage() {
  const { isAuthenticated, isProvider, user } = useAuth();

  const { data: providerData, isLoading: providerLoading } = useSWR(
    isAuthenticated && isProvider ? "my-provider" : null,
    () => api.getMyProvider(),
    { revalidateOnFocus: false }
  );

  const { data: mealsData } = useSWR(
    isAuthenticated && isProvider ? "my-meals" : null,
    () => api.getMyMeals(),
    { revalidateOnFocus: false }
  );

  const { data: ordersData } = useSWR(
    isAuthenticated && isProvider ? "provider-orders" : null,
    () => api.getProviderOrders(),
    { revalidateOnFocus: false }
  );

  const provider = providerData?.data;
  const meals = mealsData?.data || [];
  const orders: Order[] = ordersData?.data || [];

  if (!isAuthenticated || !isProvider) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This page is only accessible to restaurant providers
            </p>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (providerLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // No provider profile yet
  if (!provider) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-lg text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle>Create Your Restaurant Profile</CardTitle>
            <CardDescription>
              You need to set up your restaurant profile before you can start adding meals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/provider/setup">Set Up Restaurant</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Provider not approved
  if (!provider.isApproved) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-lg text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle>Pending Approval</CardTitle>
            <CardDescription>
              Your restaurant profile is awaiting admin approval. You&apos;ll be able to add meals once approved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              <p><strong>Restaurant:</strong> {provider.restaurantName}</p>
              <p><strong>Address:</strong> {provider.address}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingOrders = orders.filter((o) => o.status === "PLACED").length;
  const preparingOrders = orders.filter((o) => o.status === "PREPARING").length;
  const totalRevenue = orders
    .filter((o) => o.status === "DELIVERED")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">
          Manage your restaurant and orders from here
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Meals
            </CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Orders
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Preparing
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{preparingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Menu Management</CardTitle>
            <CardDescription>Add and manage your restaurant&apos;s meals</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button asChild>
              <Link href="/provider/menu">Manage Menu</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/provider/menu/new">Add Meal</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>View and manage incoming orders</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button asChild>
              <Link href="/provider/orders">View Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">Order #{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} items - ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${
                      order.status === "PLACED" ? "text-yellow-600" :
                      order.status === "PREPARING" ? "text-blue-600" :
                      order.status === "READY" ? "text-green-600" :
                      order.status === "DELIVERED" ? "text-muted-foreground" :
                      "text-red-600"
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
