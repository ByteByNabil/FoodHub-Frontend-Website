"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import type { Category } from "@/lib/types";

interface EditMealPageProps {
  params: Promise<{ id: string }>;
}

export default function EditMealPage({ params }: EditMealPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, isProvider } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
    categoryId: "",
    isAvailable: true,
  });

  const { data: mealData, isLoading: mealLoading } = useSWR(
    isAuthenticated && isProvider ? ["my-meal", id] : null,
    () => api.getMyMealById(id),
    { revalidateOnFocus: false }
  );

  const { data: categoriesData } = useSWR(
    "categories",
    () => api.getCategories(),
    { revalidateOnFocus: false }
  );

  const meal = mealData?.data;
  const categories: Category[] = categoriesData?.data || [];

  useEffect(() => {
    if (meal) {
      setFormData({
        title: meal.title,
        price: meal.price.toString(),
        description: meal.description || "",
        image: meal.image || "",
        categoryId: meal.categoryId,
        isAvailable: meal.isAvailable,
      });
    }
  }, [meal]);

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

  if (mealLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.updateMeal(id, {
        title: formData.title,
        price: parseFloat(formData.price),
        description: formData.description || undefined,
        image: formData.image || undefined,
        categoryId: formData.categoryId,
        isAvailable: formData.isAvailable,
      });

      toast.success("Meal updated successfully!");
      mutate("my-meals");
      router.push("/provider/menu");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update meal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/provider/menu">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Menu
        </Link>
      </Button>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Meal</CardTitle>
          <CardDescription>Update your meal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Meal Name *</Label>
              <Input
                id="title"
                placeholder="e.g., Margherita Pizza"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="9.99"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your meal..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
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
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="isAvailable">Available</Label>
                <p className="text-sm text-muted-foreground">
                  Make this meal visible to customers
                </p>
              </div>
              <Switch
                id="isAvailable"
                checked={formData.isAvailable}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isAvailable: checked })
                }
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/provider/menu">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
