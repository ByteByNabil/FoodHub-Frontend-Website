"use client";

import Link from "next/link";
import { Users, Package, Tag, TrendingUp, Loader2, Store } from "lucide-react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import type { Order, User } from "@/lib/types";
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
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const { data: usersData, isLoading: usersLoading } = useSWR(
    "admin-users",
    () => api.getAllUsers(),
    { revalidateOnFocus: false }
  );

  const { data: ordersData } = useSWR(
    "admin-orders",
    () => api.getAllOrders(),
    { revalidateOnFocus: false }
  );

  const { data: categoriesData } = useSWR(
    "categories",
    () => api.getCategories(),
    { revalidateOnFocus: false }
  );

  const { data: providersData } = useSWR(
    "providers",
    () => api.getProviders(),
    { revalidateOnFocus: false }
  );

  const users: User[] = usersData?.data || [];
  const orders: Order[] = ordersData?.data || [];
  const categories = categoriesData?.data || [];
  const providers = providersData?.data || [];

  if (usersLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalRevenue = orders
    .filter((o) => o.status === "DELIVERED")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const customerCount = users.filter((u) => u.role === "CUSTOMER").length;
  const providerCount = users.filter((u) => u.role === "PROVIDER").length;

  // Prepare Chart Data
  // 1. Roles Pie Chart
  const roleData = [
    { name: "Customers", value: customerCount },
    { name: "Providers", value: providerCount },
    { name: "Admins", value: users.length - customerCount - providerCount },
  ].filter(d => d.value > 0);

  // 2. Orders by Status Bar Chart
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const statusData = Object.keys(statusCounts).map(status => ({
    name: status,
    count: statusCounts[status]
  }));

  // 3. Revenue Line Chart (mocking over last few orders by Date)
  // Sort orders by createdAt
  const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  // Group by date string (e.g., "MM/DD")
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
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}. Here&apos;s what&apos;s happening across the platform today.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {customerCount} customers, {providerCount} providers
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Restaurants
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.length}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Total Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="col-span-2 shadow-sm border-0">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
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
            <CardTitle>User Roles</CardTitle>
            <CardDescription>Platform demographic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {roleData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {roleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">Not enough data</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-3 shadow-sm border-0">
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
            <CardDescription>Current state of all orders</CardDescription>
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

    </div>
  );
}
