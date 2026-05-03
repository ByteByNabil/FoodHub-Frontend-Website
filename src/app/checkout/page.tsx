"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, ArrowLeft, Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const checkoutSchema = z.object({
  address: z.string().min(5, "Please enter a complete delivery address"),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, isCustomer } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      address: "",
    },
  });

  // Redirect if not auth or empty cart
  if (!isAuthenticated || !isCustomer || items.length === 0) {
    if (typeof window !== "undefined") {
      router.push("/cart");
    }
    return null;
  }

  const onSubmit = async (values: z.infer<typeof checkoutSchema>) => {
    try {
      setIsProcessing(true);

      // 1. Create the Order in the database
      const orderItems = items.map((item) => ({
        mealId: item.meal.id,
        quantity: item.quantity,
      }));

      const orderResponse = await api.createOrder({
        items: orderItems,
        address: values.address,
      });

      if (!orderResponse.data) {
        throw new Error("Failed to create order");
      }

      const orderId = orderResponse.data.id;

      // 2. Generate the Stripe Checkout Session
      const paymentResponse = await api.createPayment(orderId);

      if (!paymentResponse.data?.url) {
        throw new Error("Failed to generate payment link");
      }

      // 3. Clear local cart
      clearCart();

      // 4. Redirect to Stripe
      window.location.href = paymentResponse.data.url;
      
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "An error occurred during checkout. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold">Secure Checkout</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form Section */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Delivery Details
                </CardTitle>
                <CardDescription>
                  Where should we deliver your delicious food?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Delivery Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 Main St, Apt 4B, New York, NY 10001"
                              {...field}
                              className="h-12 bg-muted/50"
                              disabled={isProcessing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit is handled via the sidebar button, but we keep a hidden one here to support 'enter' key */}
                    <button type="submit" className="hidden" />
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              Payments are securely processed by Stripe
            </div>
          </motion.div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="sticky top-24 border-0 shadow-lg">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                  {items.map((item) => (
                    <div key={item.meal.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground max-w-[180px] truncate">
                        {item.quantity}x {item.meal.title}
                      </span>
                      <span className="font-medium">
                        ${(item.meal.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  className="w-full h-14 text-base shadow-lg shadow-primary/25"
                  size="lg"
                  disabled={isProcessing}
                  onClick={() => form.handleSubmit(onSubmit)()}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Redirecting to Stripe...
                    </>
                  ) : (
                    <>
                      Pay ${(totalPrice).toFixed(2)}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
