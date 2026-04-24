"use client";

import { useState } from "react";
import Link from "next/link";
import { Store, Loader2, CheckCircle, Clock, Search } from "lucide-react";
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
import type { ProviderProfile } from "@/lib/types";

export default function AdminProvidersPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [approvingProvider, setApprovingProvider] = useState<string | null>(null);

  const { data: providersData, isLoading } = useSWR(
    isAuthenticated && isAdmin ? "all-providers" : null,
    async () => {
      // Get all users who are providers
      const usersRes = await api.getAllUsers();
      const providers = usersRes.data.filter((u) => u.role === "PROVIDER");
      
      // For each provider, try to get their profile
      const providerProfiles = await Promise.all(
        providers.map(async (user) => {
          try {
            const profileRes = await api.getProviderById(user.id);
            return profileRes.data;
          } catch {
            return null;
          }
        })
      );
      
      return providerProfiles.filter(Boolean);
    },
    { revalidateOnFocus: false }
  );

  const providers: ProviderProfile[] = providersData || [];

  const filteredProviders = providers.filter(
    (provider) =>
      provider?.restaurantName?.toLowerCase().includes(search.toLowerCase()) ||
      provider?.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = async (providerId: string) => {
    setApprovingProvider(providerId);
    try {
      await api.approveProvider(providerId);
      toast.success("Provider approved successfully");
      mutate("all-providers");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to approve provider");
    } finally {
      setApprovingProvider(null);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This page is only accessible to administrators
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
        <h1 className="mb-2 text-3xl font-bold">Restaurant Providers</h1>
        <p className="text-muted-foreground">Manage restaurant providers and approvals</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              All Providers ({providers.length})
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search providers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-[250px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProviders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProviders.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell className="font-medium">
                        {provider.restaurantName}
                      </TableCell>
                      <TableCell>{provider.user?.name || "N/A"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {provider.address}
                      </TableCell>
                      <TableCell>
                        {provider.isApproved ? (
                          <Badge variant="outline" className="gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Approved
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {!provider.isApproved && (
                          <Button
                            size="sm"
                            onClick={() => handleApprove(provider.id)}
                            disabled={approvingProvider === provider.id}
                          >
                            {approvingProvider === provider.id ? (
                              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            )}
                            Approve
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <Store className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No providers found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
