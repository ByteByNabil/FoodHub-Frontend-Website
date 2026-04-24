"use client";

import Link from "next/link";
import { Plus, Edit, Trash2, Loader2, UtensilsCrossed } from "lucide-react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import type { Meal } from "@/lib/types";

export default function ProviderMenuPage() {
  const { isAuthenticated, isProvider } = useAuth();

  const { data: mealsData, isLoading } = useSWR(
    isAuthenticated && isProvider ? "my-meals" : null,
    () => api.getMyMeals(),
    { revalidateOnFocus: false }
  );

  const meals: Meal[] = mealsData?.data || [];

  const handleDelete = async (mealId: string) => {
    try {
      await api.deleteMeal(mealId);
      toast.success("Meal deleted successfully");
      mutate("my-meals");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete meal");
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">Add and manage your restaurant&apos;s meals</p>
        </div>
        <Button asChild>
          <Link href="/provider/menu/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Meal
          </Link>
        </Button>
      </div>

      {meals.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => (
            <Card key={meal.id} className="overflow-hidden">
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={
                    meal.image ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"
                  }
                  alt={meal.title}
                  className="h-full w-full object-cover"
                />
                {!meal.isAvailable && (
                  <Badge variant="secondary" className="absolute right-2 top-2">
                    Unavailable
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{meal.title}</h3>
                    <p className="text-lg font-bold text-primary">
                      ${meal.price.toFixed(2)}
                    </p>
                  </div>
                  <Badge variant={meal.isAvailable ? "default" : "secondary"}>
                    {meal.isAvailable ? "Available" : "Hidden"}
                  </Badge>
                </div>
                {meal.description && (
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {meal.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/provider/menu/${meal.id}/edit`}>
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Meal?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &ldquo;{meal.title}&rdquo;? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(meal.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <CardContent className="py-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">No Meals Yet</h2>
            <p className="mb-4 text-muted-foreground">
              Add your first meal to start receiving orders
            </p>
            <Button asChild>
              <Link href="/provider/menu/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Meal
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
