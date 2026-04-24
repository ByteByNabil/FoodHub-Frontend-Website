"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Store, Loader2 } from "lucide-react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MealCard } from "@/components/meal-card";
import { api } from "@/lib/api";

interface ProviderPageProps {
  params: Promise<{ id: string }>;
}

export default function ProviderDetailPage({ params }: ProviderPageProps) {
  const { id } = use(params);

  const { data: providerData, isLoading } = useSWR(
    ["provider", id],
    () => api.getProviderById(id),
    { revalidateOnFocus: false }
  );

  const provider = providerData?.data;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Restaurant Not Found</h1>
          <Button asChild>
            <Link href="/providers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Restaurants
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const meals = provider.meals || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/providers">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Restaurants
        </Link>
      </Button>

      {/* Provider Header */}
      <div className="mb-8 overflow-hidden rounded-lg border bg-card">
        <div className="relative aspect-[3/1] bg-muted">
          <div className="flex h-full items-center justify-center">
            <Store className="h-24 w-24 text-muted-foreground/30" />
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <h1 className="text-2xl font-bold">{provider.restaurantName}</h1>
                {provider.isApproved && (
                  <Badge variant="secondary">Verified</Badge>
                )}
              </div>
              {provider.description && (
                <p className="mb-3 text-muted-foreground">
                  {provider.description}
                </p>
              )}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{provider.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div>
        <h2 className="mb-6 text-xl font-semibold">Menu ({meals.length} items)</h2>
        {meals.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={{ ...meal, provider }} />
            ))}
          </div>
        ) : (
          <div className="flex h-48 flex-col items-center justify-center rounded-lg border bg-muted/50 text-center">
            <p className="text-lg font-medium">No meals available</p>
            <p className="text-muted-foreground">
              This restaurant hasn&apos;t added any meals yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
