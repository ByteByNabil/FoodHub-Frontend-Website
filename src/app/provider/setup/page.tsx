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
    image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.createProvider({
        restaurantName: formData.restaurantName,
        description: formData.description || undefined,
        address: formData.address,
        image: formData.image || undefined,
      });

      toast.success("Restaurant profile created! Awaiting admin approval.");
      router.push("/provider/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div>
        <Card className="w-full max-w-lg mx-auto mt-12 border-0 shadow-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Sign In Required</CardTitle>
            <CardDescription>
              You need to be logged in as a Provider to set up a restaurant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Logged in but NOT a Provider
  if (!isProvider) {
    return (
      <div>
        <Card className="w-full max-w-lg mx-auto mt-12 border-0 shadow-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Store className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Provider Account Required</CardTitle>
            <CardDescription>
              You are currently logged in as a <strong>Customer</strong>. Only accounts
              with the <strong>Provider</strong> role can create a restaurant profile.
              <br /><br />
              Please register a new account and select{" "}
              <strong>&quot;I want to sell food&quot;</strong> during sign-up.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/register">Register as Provider</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card className="w-full max-w-lg mx-auto mt-12 border-0 shadow-md">
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
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
              {formData.image && (
                <div className="mt-3 overflow-hidden rounded-lg border aspect-video relative max-w-sm">
                  <img
                    src={formData.image}
                    alt="Restaurant Preview"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
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
