"use client";

import Link from "next/link";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  Shield,
  Truck,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } =
    useCart();
  const { isAuthenticated, isCustomer } = useAuth();

  if (!isAuthenticated || !isCustomer) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-md text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-muted">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Sign In Required</h1>
          <p className="text-muted-foreground mb-8">
            Please sign in as a customer to view and manage your cart.
          </p>
          <Button
            size="lg"
            className="h-12 px-8 shadow-lg shadow-primary/25"
            asChild
          >
            <Link href="/login">
              Sign In to Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-md text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10">
            <ShoppingBag className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven&apos;t added any delicious meals yet. Start
            exploring!
          </p>
          <Button
            size="lg"
            className="h-12 px-8 shadow-lg shadow-primary/25"
            asChild
          >
            <Link href="/meals">
              <Sparkles className="mr-2 h-4 w-4" />
              Browse Meals
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <Link
                href="/meals"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <p className="text-muted-foreground mt-1">
                {items.length} {items.length === 1 ? "item" : "items"} in your
                cart
              </p>
            </div>
            <Button variant="outline" onClick={clearCart} className="h-11">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Cart
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <AnimatePresence initial={false} mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.meal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 p-6 border-b border-border last:border-0"
                    >
                      <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl">
                        <img
                          src={
                            item.meal.image ||
                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop"
                          }
                          alt={item.meal.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link
                              href={`/meals/${item.meal.id}`}
                              className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1"
                            >
                              {item.meal.title}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">
                              ${item.meal.price.toFixed(2)} per item
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeFromCart(item.meal.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-4">
                          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-md"
                              onClick={() =>
                                updateQuantity(item.meal.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-md"
                              onClick={() =>
                                updateQuantity(item.meal.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <span className="text-xl font-bold text-primary">
                            ${(item.meal.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="sticky top-24 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <Badge variant="secondary" className="font-normal">
                    Free
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Trust badges */}
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                      <Truck className="h-4 w-4 text-accent" />
                    </div>
                    <span>Free delivery on orders over $15</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <span>Estimated delivery: 25-35 min</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10">
                      <Shield className="h-4 w-4 text-chart-3" />
                    </div>
                    <span>Secure checkout with SSL</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  asChild
                  className="w-full h-14 text-base shadow-lg shadow-primary/25"
                  size="lg"
                >
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
