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
      toast.warning("Cart cleared! You can only order from one restaurant at a time.");
    }

    addToCart(meal);
    toast.success(`${meal.title} added to cart`);
  };

  return (
    <Link href={`/meals/${meal.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="group h-full overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={
                meal.image ||
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"
              }
              alt={meal.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Top badges */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
              {meal.category && (
                <Badge className="bg-background/90 text-foreground backdrop-blur-sm border-0 shadow-md">
                  {meal.category.name}
                </Badge>
              )}
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
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
            
            {/* Quick add button - shows on hover */}
            {meal.isAvailable && (
              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  onClick={handleAddToCart}
                  className="w-full h-11 shadow-lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
          
          <CardContent className="p-5">
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
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                {meal.description}
              </p>
            )}
            
            {/* Bottom section */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              {/* Rating and time */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium">4.5</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-xs">15-25 min</span>
                </div>
              </div>
              
              {/* Price */}
              <div className="text-right">
                <span className="text-xl font-bold text-primary">
                  ${meal.price.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
