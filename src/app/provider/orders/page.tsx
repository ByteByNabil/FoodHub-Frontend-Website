"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Package, Loader2, Clock, CheckCircle, XCircle, ChefHat, Truck, MapPin, Search, ChevronLeft, ChevronRight } from "lucide-react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { data: ordersData, isLoading } = useSWR(
    "provider-orders",
    () => api.getProviderOrders(),
    { revalidateOnFocus: false }
  );

  const orders: Order[] = ordersData?.data || [];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer?.name?.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [orders, search]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, page]);

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

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and fulfill customer orders</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              All Orders ({filteredOrders.length})
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 w-[250px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => {
                  const status = statusConfig[order.status];
                  const StatusIcon = status.icon;
                  const canUpdate = nextStatus[order.status];

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        #{order.id.slice(-8).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.customer?.name || "Unknown"}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" /> {order.address}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          {order.items.slice(0, 2).map(item => (
                            <div key={item.id}>{item.quantity}x {item.meal?.title}</div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-muted-foreground">+{order.items.length - 2} more</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        \${order.totalPrice.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell className="text-right">
                        {canUpdate ? (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, canUpdate)}
                            disabled={updatingOrder === order.id}
                          >
                            {updatingOrder === order.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              `Mark ${canUpdate}`
                            )}
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">Done</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between px-2">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm font-medium">
                  Page {page} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
