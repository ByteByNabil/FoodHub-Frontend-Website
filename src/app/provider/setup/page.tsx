"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";

export default function ProviderSetupPage() {
  const router = useRouter();
  const { isAuthenticated, isProvider } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    restaurantName: "",
    description: "",
    address: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.createProvider({
        restaurantName: formData.restaurantName,
        description: formData.description || undefined,
        address: formData.address,
      });

      toast.success("Restaurant profile created! Awaiting admin approval.");
      router.push("/provider/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Store className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Set Up Your Restaurant</CardTitle>
          <CardDescription>
            Create your restaurant profile to start selling meals on FoodHub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Restaurant Name *</Label>
              <Input
                id="restaurantName"
                placeholder="e.g., Joe's Pizza"
                value={formData.restaurantName}
                onChange={(e) =>
                  setFormData({ ...formData, restaurantName: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell customers about your restaurant..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="123 Main St, City, State"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Restaurant Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
