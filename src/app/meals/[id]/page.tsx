"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingCart, Star, Store, Loader2 } from "lucide-react";
import useSWR from "swr";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import type { Review } from "@/lib/types";

interface MealPageProps {
  params: Promise<{ id: string }>;
}

export default function MealDetailPage({ params }: MealPageProps) {
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { addToCart, providerId } = useCart();
  const { isAuthenticated, isCustomer, user } = useAuth();

  const { data: mealData, isLoading } = useSWR(
    ["meal", id],
    () => api.getMealById(id),
    { revalidateOnFocus: false }
  );

  const { data: reviewsData, mutate: mutateReviews } = useSWR(
    ["meal-reviews", id],
    () => api.getMealReviews(id),
    { revalidateOnFocus: false }
  );

  const { data: ratingData, mutate: mutateRating } = useSWR(
    ["meal-rating", id],
    () => api.getMealRating(id),
    { revalidateOnFocus: false }
  );

  const { data: myOrdersData } = useSWR(
    isAuthenticated ? ["my-orders-for-review"] : null,
    () => api.getMyOrders(),
    { revalidateOnFocus: false }
  );

  const meal = mealData?.data;
  const reviews: Review[] = reviewsData?.data || [];
  const rating = ratingData?.data;
  const myOrders = myOrdersData?.data || [];
  const hasDeliveredOrder = myOrders.some(
    (order) =>
      order.status === "DELIVERED" &&
      order.items.some((item) => item.mealId === id),
  );
  const myReview = user ? reviews.find((review) => review.userId === user.id) : undefined;
  const hasReviewedAlready = reviews.some((review) => review.userId === user?.id);
  const orderedReviews = myReview
    ? [myReview, ...reviews.filter((review) => review.id !== myReview.id)]
    : reviews;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    if (!isCustomer) {
      toast.error("Only customers can add items to cart");
      return;
    }

    if (!meal) return;

    if (providerId && providerId !== meal.providerId) {
      toast.warning("Cart cleared! You can only order from one restaurant at a time.");
    }

    addToCart(meal, quantity);
    toast.success(`${quantity}x ${meal.title} added to cart`);
    setQuantity(1);
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to write a review");
      return;
    }

    if (!isCustomer) {
      toast.error("Only customers can submit reviews");
      return;
    }

    if (!hasDeliveredOrder) {
      toast.error("You can only review meals from delivered orders");
      return;
    }

    if (hasReviewedAlready) {
      toast.error("You already reviewed this meal");
      return;
    }

    if (selectedRating < 1 || selectedRating > 5) {
      toast.error("Please select a rating from 1 to 5 stars");
      return;
    }

    setIsSubmittingReview(true);

    try {
      await api.createReview({
        mealId: id,
        rating: selectedRating,
        comment: reviewComment.trim() || undefined,
      });

      await Promise.all([mutateReviews(), mutateRating()]);
      setSelectedRating(0);
      setHoveredRating(0);
      setReviewComment("");
      toast.success("Review submitted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit review",
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Meal Not Found</h1>
          <Button asChild>
            <Link href="/meals">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Meals
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const avgRating = rating?._avg?.rating || 0;
  const reviewCount = rating?._count?.rating || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/meals">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Meals
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <img
            src={
              meal.image ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop"
            }
            alt={meal.title}
            className="h-full w-full object-cover"
          />
          {!meal.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge variant="secondary" className="text-lg">
                Not Available
              </Badge>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            {meal.category && (
              <Badge className="mb-3">{meal.category.name}</Badge>
            )}
            <h1 className="mb-2 text-3xl font-bold">{meal.title}</h1>
            {meal.description && (
              <p className="text-muted-foreground">{meal.description}</p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(avgRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {avgRating.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>

          {/* Provider */}
          {meal.provider && (
            <Link
              href={`/providers/${meal.provider.id}`}
              className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {meal.provider.restaurantName || meal.provider.user?.name}
                </p>
                <p className="text-sm text-muted-foreground">View restaurant</p>
              </div>
            </Link>
          )}

          {/* Price and Add to Cart */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-3xl font-bold text-primary">
                  ${meal.price.toFixed(2)}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-lg font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
                disabled={!meal.isAvailable}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart - ${(meal.price * quantity).toFixed(2)}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews ({reviewCount})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-8 rounded-lg border bg-muted/20 p-4">
              <h3 className="mb-2 text-lg font-semibold">Write a Review</h3>
              {!isAuthenticated ? (
                <p className="text-sm text-muted-foreground">
                  Sign in as a customer to rate and review this meal.
                </p>
              ) : !isCustomer ? (
                <p className="text-sm text-muted-foreground">
                  Only customer accounts can submit meal reviews.
                </p>
              ) : hasReviewedAlready ? (
                <p className="text-sm text-muted-foreground">
                  You have already reviewed this meal.
                </p>
              ) : !hasDeliveredOrder ? (
                <p className="text-sm text-muted-foreground">
                  You can review this meal after one of your orders for it is delivered.
                </p>
              ) : (
                <>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Share your rating and experience with this meal.
                  </p>

                  <div className="mb-4 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const activeRating = hoveredRating || selectedRating;

                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setSelectedRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="rounded-sm p-1 transition-transform hover:scale-110"
                          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= activeRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {selectedRating > 0
                        ? `${selectedRating} out of 5`
                        : "Choose a rating"}
                    </span>
                  </div>

                  <Textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell others what you liked about this meal"
                    rows={4}
                    className="mb-4"
                  />

                  <Button
                    type="button"
                    onClick={handleSubmitReview}
                    disabled={isSubmittingReview}
                  >
                    {isSubmittingReview ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting Review...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </>
              )}
            </div>

            {myReview && (
              <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">Your Review</h3>
                    <p className="text-sm text-muted-foreground">
                      Submitted on {new Date(myReview.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= myReview.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {myReview.comment || "You rated this meal without leaving a written comment."}
                </p>
              </div>
            )}

            {orderedReviews.length > 0 ? (
              <div className="space-y-6">
                {orderedReviews.map((review) => (
                  <div key={review.id}>
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {(review.userId === user?.id ? user?.name : review.user?.name)?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-medium">
                            {review.userId === user?.id
                              ? "You"
                              : review.user?.name || "Anonymous"}
                          </span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-muted-foreground">{review.comment}</p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                No reviews yet. Be the first to review this meal!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
