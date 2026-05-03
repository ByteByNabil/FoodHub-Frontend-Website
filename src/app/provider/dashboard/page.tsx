"use client";

import Link from "next/link";
import { Package, UtensilsCrossed, TrendingUp, Clock, Loader2, AlertCircle } from "lucide-react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import type { Order } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

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
      <div>
        <Card className="mx-auto max-w-lg text-center mt-12">
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
      <div>
        <Card className="mx-auto max-w-lg text-center mt-12">
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

  // Prepare Chart Data
  // 1. Orders by Status Bar Chart
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const statusData = Object.keys(statusCounts).map(status => ({
    name: status,
    count: statusCounts[status]
  }));

  // 2. Revenue Line Chart (mocking over last few orders by Date)
  const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const revenueByDate = sortedOrders.reduce((acc, order) => {
    if (order.status !== "DELIVERED") return acc;
    const dateStr = new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    acc[dateStr] = (acc[dateStr] || 0) + order.totalPrice;
    return acc;
  }, {} as Record<string, number>);
  
  const revenueData = Object.keys(revenueByDate).map(date => ({
    date,
    revenue: revenueByDate[date]
  }));

  return (
    <div>
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

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="shadow-sm border-0">
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
            <CardDescription>Daily revenue from delivered orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tickMargin={10} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                    <RechartsTooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">Not enough data</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0">
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
            <CardDescription>Current state of your orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} />
                    <YAxis axisLine={false} tickLine={false} />
                    <RechartsTooltip />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">Not enough data</div>
              )}
            </div>
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
