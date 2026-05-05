"use client";

import Link from "next/link";
import { Star, Plus, Store, Clock, Heart } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import type { Meal } from "@/lib/types";

interface MealCardProps {
  meal: Meal;
}

/** Map category keywords → relevant Unsplash food photo */
const CATEGORY_IMAGES: Record<string, string> = {
  pizza:      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
  burger:     "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
  burgers:    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
  sushi:      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop",
  pasta:      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
  salad:      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
  salads:     "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
  dessert:    "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop",
  desserts:   "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop",
  taco:       "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop",
  tacos:      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop",
  indian:     "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
  chinese:    "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop",
  bbq:        "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop",
  sandwich:   "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop",
  sandwiches: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop",
  vegan:      "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&h=300&fit=crop",
  vegetarian: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&h=300&fit=crop",
  chicken:    "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=400&h=300&fit=crop",
  seafood:    "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=400&h=300&fit=crop",
  steak:      "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
  noodles:    "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=300&fit=crop",
  soup:       "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
  rice:       "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
  breakfast:  "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop",
  drinks:     "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop",
  juice:      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop",
  coffee:     "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop";

function getFallbackImage(categoryName?: string): string {
  if (!categoryName) return DEFAULT_IMAGE;
  const key = categoryName.toLowerCase().trim();
  // Direct match
  if (CATEGORY_IMAGES[key]) return CATEGORY_IMAGES[key];
  // Partial match (e.g. "Fresh Salads" → "salad")
  for (const [keyword, url] of Object.entries(CATEGORY_IMAGES)) {
    if (key.includes(keyword)) return url;
  }
  return DEFAULT_IMAGE;
}

export function MealCard({ meal }: MealCardProps) {
  const { addToCart, providerId } = useCart();
  const { isAuthenticated, isCustomer } = useAuth();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    if (!isCustomer) {
      toast.error("Only customers can add items to cart");
      return;
    }

    // Warn if adding from different provider
    if (providerId && providerId !== meal.providerId) {
      toast.warning(
        "Cart cleared! You can only order from one restaurant at a time.",
      );
    }

    addToCart(meal);
    toast.success(`${meal.title} added to cart`);
  };

  return (
    <div className="h-full cursor-pointer">
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="h-full">
        <Card className="group h-full flex flex-col overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={meal.image || getFallbackImage(meal.category?.name)}
              alt={meal.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getFallbackImage(meal.category?.name);
              }}
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Top badges */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
              {meal.category && (
                <Badge className="bg-background/90 text-foreground backdrop-blur-sm border-0 shadow-md">
                  {meal.category.name}
                </Badge>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-muted-foreground backdrop-blur-sm shadow-md transition-colors hover:text-primary hover:bg-background"
              >
                <Heart className="h-4 w-4" />
              </button>
            </div>

            {/* Unavailable overlay */}
            {!meal.isAvailable && (
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/70 backdrop-blur-sm">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  Currently Unavailable
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-5 flex flex-col flex-1">
            {/* Restaurant info */}
            {meal.provider && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Store className="h-3.5 w-3.5" />
                <span className="line-clamp-1 font-medium">
                  {meal.provider.restaurantName || meal.provider.user?.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h3 className="mb-2 line-clamp-1 text-lg font-semibold group-hover:text-primary transition-colors">
              {meal.title}
            </h3>

            {/* Description */}
            {meal.description && (
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground leading-relaxed flex-1">
                {meal.description}
              </p>
            )}

            {/* Bottom section (Meta Info & Buttons) */}
            <div className="mt-auto pt-4 border-t border-border flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                {/* Meta info */}
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-foreground">4.5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>25 min</span>
                  </div>
                </div>
                {/* Price */}
                <span className="text-lg font-bold text-primary">
                  ${meal.price.toFixed(2)}
                </span>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 font-semibold" asChild>
                  <Link href={`/meals/${meal.id}`}>
                    View Details
                  </Link>
                </Button>
                {meal.isAvailable && (
                  <Button 
                    onClick={handleAddToCart}
                    size="icon"
                    className="shrink-0"
                    title="Add to Cart"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
