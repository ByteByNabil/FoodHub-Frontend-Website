"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  ChefHat,
  Truck,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import useSWR from "swr";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    icon: typeof Clock;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PLACED: { label: "Placed", icon: Clock, variant: "secondary" },
  PREPARING: { label: "Preparing", icon: ChefHat, variant: "default" },
  READY: { label: "Ready", icon: Package, variant: "default" },
  DELIVERED: { label: "Delivered", icon: CheckCircle, variant: "outline" },
  CANCELLED: { label: "Cancelled", icon: XCircle, variant: "destructive" },
};

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; color: string; icon: typeof Clock }
> = {
  PENDING: {
    label: "Payment Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  PAID: {
    label: "Paid",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  FAILED: {
    label: "Payment Failed",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle,
  },
  REFUNDED: {
    label: "Refunded",
    color: "bg-gray-100 text-gray-800",
    icon: XCircle,
  },
};

function PayNowButton({
  orderId,
  totalPrice,
  isLoading,
  onPay,
}: {
  orderId: string;
  totalPrice: number;
  isLoading: boolean;
  onPay: (orderId: string) => void;
}) {
  if (isLoading) {
    return (
      <Button disabled size="sm" className="shrink-0">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Redirecting...
      </Button>
    );
  }

  return (
    <Button onClick={() => onPay(orderId)} size="sm" className="shrink-0">
      <CreditCard className="mr-2 h-4 w-4" />
      Pay ${totalPrice.toFixed(2)}
    </Button>
  );
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = paymentStatusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${config.color}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function OrderCard({
  order,
  payingOrderId,
  onPayNow,
}: {
  order: Order;
  payingOrderId: string | null;
  onPayNow: (orderId: string) => void;
}) {
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;
  const canPay =
    (order.paymentStatus === "PENDING" || order.paymentStatus === "FAILED") &&
    order.status !== "CANCELLED";
  const isPayingThisOrder = payingOrderId === order.id;

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
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={status.variant} className="gap-1">
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </Badge>
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {order.provider && (
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">From:</span>
              <span className="font-medium">
                {order.provider.restaurantName || order.provider.user?.name}
              </span>
            </div>
          )}

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
              <span className="text-primary">
                ${order.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="text-sm">
            <span className="text-muted-foreground">Delivery Address: </span>
            <span>{order.address}</span>
          </div>

          {canPay && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      {order.paymentStatus === "FAILED"
                        ? "Payment failed - Please try again"
                        : "Payment required to complete your order"}
                    </p>
                    <p className="text-xs text-yellow-700">
                      Complete payment via Stripe to process your order
                    </p>
                  </div>
                </div>
                <PayNowButton
                  orderId={order.id}
                  totalPrice={order.totalPrice}
                  isLoading={isPayingThisOrder}
                  onPay={onPayNow}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function OrdersPage() {
  const { isAuthenticated, isCustomer } = useAuth();
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);

  const { data: ordersData, isLoading } = useSWR(
    isAuthenticated && isCustomer ? "my-orders" : null,
    () => api.getMyOrders(),
    { revalidateOnFocus: false },
  );

  const orders: Order[] = ordersData?.data || [];

  const handlePayNow = async (orderId: string) => {
    setPayingOrderId(orderId);
    try {
      const paymentResponse = await api.createPayment(orderId);

      if (paymentResponse.data?.url) {
        window.location.href = paymentResponse.data.url;
      } else {
        throw new Error("Failed to create payment session");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to initiate payment",
      );
      setPayingOrderId(null);
    }
  };

  if (!isAuthenticated || !isCustomer) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Please sign in as a customer to view your orders
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">
          Track and manage your food orders
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              payingOrderId={payingOrderId}
              onPayNow={handlePayNow}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <CardContent className="py-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">No Orders Yet</h2>
            <p className="mb-4 text-muted-foreground">
              You haven&apos;t placed any orders yet
            </p>
            <Button asChild>
              <Link href="/meals">Browse Meals</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
