"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  UtensilsCrossed,
  ArrowRight,
  ChefHat,
  ShoppingBag,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signIn, signUp } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

const registerSchema = z.object({
  role: z.enum(["CUSTOMER", "PROVIDER"]),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "CUSTOMER",
      name: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);

    try {
      const { error } = await signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
        phone: values.phone || undefined,
        role: values.role,
      });

      if (error) {
        toast.error(error.message || "Failed to create account");
        setIsLoading(false);
        return;
      }

      toast.success(
        "Account created! Please check your email to verify your account."
      );
      router.push("/login");
    } catch {
      toast.error("An error occurred during registration");
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      toast.error("Failed to continue with Google");
      setIsLoading(false);
    }
  };

  const benefits = [
    "Access to 1000+ restaurants",
    "Exclusive deals and discounts",
    "Real-time order tracking",
    "24/7 customer support",
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] flex">
      {/* Left side - Visual */}
      <motion.div
        className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-20 right-20 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative z-10 max-w-md px-8">
          <Badge variant="secondary" className="mb-6">
            Join 500K+ Users
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Start Your
            <span className="block text-gradient mt-2">Food Journey</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Create your account and get instant access to thousands of delicious
            meals from top-rated restaurants.
          </p>

          {/* Benefits list */}
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <motion.li
                key={benefit}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-muted-foreground">{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-8 group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
                <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">FoodHub</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">
              Join FoodHub and start ordering delicious meals
            </p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm font-medium">I want to</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => field.onChange("CUSTOMER")}
                              className={cn(
                                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                field.value === "CUSTOMER"
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50 hover:bg-muted/50"
                              )}
                            >
                              <div
                                className={cn(
                                  "flex h-12 w-12 items-center justify-center rounded-xl",
                                  field.value === "CUSTOMER"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                <ShoppingBag className="h-6 w-6" />
                              </div>
                              <span className="text-sm font-medium">Order Food</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => field.onChange("PROVIDER")}
                              className={cn(
                                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                field.value === "PROVIDER"
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50 hover:bg-muted/50"
                              )}
                            >
                              <div
                                className={cn(
                                  "flex h-12 w-12 items-center justify-center rounded-xl",
                                  field.value === "PROVIDER"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                <ChefHat className="h-6 w-6" />
                              </div>
                              <span className="text-sm font-medium">Sell Food</span>
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" className="h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium">Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+1 (555) 123" className="h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="At least 8 characters"
                              className="h-12 pr-12"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-4 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <Eye className="h-5 w-5 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <Button
                  type="submit"
                  className="w-full h-12 text-base shadow-lg shadow-primary/25 relative"
                  disabled={isLoading}
                >
                    <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity", isLoading ? "opacity-100" : "opacity-0")}>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                      Creating Account...
                    </div>
                    <div className={cn("flex items-center justify-center transition-opacity", isLoading ? "opacity-0" : "opacity-100")}>
                      Create Account
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By creating an account, you agree to our{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </Form>

              <div className="mt-8 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-4 text-muted-foreground">
                      OR CONTINUE WITH
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base font-medium"
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                >
                  <GoogleIcon />
                  Google
                </Button>

                <div className="relative pt-4">
                  <div className="absolute inset-0 flex items-center pt-4">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase pt-4">
                    <span className="bg-card px-4 text-muted-foreground">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "w-full h-12")}>
                    Sign In Instead
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
