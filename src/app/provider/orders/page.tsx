"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Loader2, Clock, CheckCircle, XCircle, ChefHat, Truck, MapPin } from "lucide-react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import type { Order, OrderStatus } from "@/lib/types";

const statusConfig: Record<OrderStatus, { label: string; icon: typeof Clock; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PLACED: { label: "Placed", icon: Clock, variant: "secondary" },
  PREPARING: { label: "Preparing", icon: ChefHat, variant: "default" },
  READY: { label: "Ready", icon: Package, variant: "default" },
  DELIVERED: { label: "Delivered", icon: CheckCircle, variant: "outline" },
  CANCELLED: { label: "Cancelled", icon: XCircle, variant: "destructive" },
};

const nextStatus: Record<string, OrderStatus> = {
  PLACED: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERED",
};

export default function ProviderOrdersPage() {
  const { isAuthenticated, isProvider } = useAuth();
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const { data: ordersData, isLoading } = useSWR(
    isAuthenticated && isProvider ? "provider-orders" : null,
    () => api.getProviderOrders(),
    { revalidateOnFocus: false }
  );

  const orders: Order[] = ordersData?.data || [];

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrder(orderId);
    try {
      await api.updateOrderStatus(orderId, newStatus);
      toast.success(`Order marked as ${newStatus.toLowerCase()}`);
      mutate("provider-orders");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update order");
    } finally {
      setUpdatingOrder(null);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeOrders = orders.filter((o) => 
    ["PLACED", "PREPARING", "READY"].includes(o.status)
  );
  const completedOrders = orders.filter((o) => 
    ["DELIVERED", "CANCELLED"].includes(o.status)
  );

  const OrderCard = ({ order }: { order: Order }) => {
    const status = statusConfig[order.status];
    const StatusIcon = status.icon;
    const canUpdate = nextStatus[order.status];

    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-lg">
                Order #{order.id.slice(-8).toUpperCase()}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <Badge variant={status.variant} className="gap-1">
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Customer Info */}
          {order.customer && (
            <div className="text-sm">
              <span className="text-muted-foreground">Customer: </span>
              <span className="font-medium">{order.customer.name}</span>
            </div>
          )}

          {/* Delivery Address */}
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <span>{order.address}</span>
          </div>

          {/* Items */}
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.meal?.title || "Unknown Item"}
                  </span>
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold">
              <span>Total</span>
              <span className="text-primary">${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Button */}
          {canUpdate && (
            <Button
              className="w-full"
              onClick={() => handleUpdateStatus(order.id, canUpdate)}
              disabled={updatingOrder === order.id}
            >
              {updatingOrder === order.id ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  {canUpdate === "PREPARING" && <ChefHat className="mr-2 h-4 w-4" />}
                  {canUpdate === "READY" && <Package className="mr-2 h-4 w-4" />}
                  {canUpdate === "DELIVERED" && <Truck className="mr-2 h-4 w-4" />}
                </>
              )}
              Mark as {canUpdate}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage and fulfill customer orders</p>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeOrders.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <Card className="text-center">
              <CardContent className="py-12">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="mb-2 text-lg font-semibold">No Active Orders</h2>
                <p className="text-muted-foreground">
                  New orders will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedOrders.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <Card className="text-center">
              <CardContent className="py-12">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <CheckCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="mb-2 text-lg font-semibold">No Completed Orders</h2>
                <p className="text-muted-foreground">
                  Completed orders will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
