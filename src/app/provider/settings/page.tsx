"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Settings, Loader2, ArrowLeft } from "lucide-react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";

export default function ProviderSettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isProvider } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    restaurantName: "",
    description: "",
    address: "",
    image: "",
  });

  const { data: providerData, isLoading } = useSWR(
    isAuthenticated && isProvider ? "my-provider" : null,
    () => api.getMyProvider(),
    { revalidateOnFocus: false }
  );

  const provider = providerData?.data;

  useEffect(() => {
    if (provider) {
      setFormData({
        restaurantName: provider.restaurantName || "",
        description: provider.description || "",
        address: provider.address || "",
        image: provider.image || "",
      });
    }
  }, [provider]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await api.updateProvider({
        restaurantName: formData.restaurantName,
        description: formData.description || undefined,
        address: formData.address,
        image: formData.image || undefined,
      });

      toast.success("Restaurant profile updated successfully!");
      mutate("my-provider");
      router.push("/provider/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
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

  return (
    <div>
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/provider/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <Card className="w-full max-w-2xl mx-auto border-0 shadow-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Settings className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Edit Restaurant Details</CardTitle>
          <CardDescription>
            Update your restaurant profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!provider ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">You haven't set up your restaurant profile yet.</p>
              <Button asChild>
                <Link href="/provider/setup">Set Up Now</Link>
              </Button>
            </div>
          ) : (
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
                  rows={4}
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
                  <div className="mt-4 overflow-hidden rounded-lg border aspect-video relative max-w-sm">
                    <img 
                      src={formData.image} 
                      alt="Restaurant Preview" 
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2NjIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTE4LjUgMTUuNWwtMy0zLTQuNSA0LjUiLz48cGF0aCBkPSJNMjEuNSAxOS41djFhMiAyIDAgMCAxLTIgMmgtMTVhMiAyIDAgMCAxLTItMnYtMTRhMiAyIDAgMCAxIDItMmgxNWEyIDIgMCAwIDEgMiAydjEiLz48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSIvPjwvc3ZnPg==';
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/provider/dashboard">Cancel</Link>
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
