"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  UtensilsCrossed,
  ArrowRight,
  Sparkles,
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
import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);

    try {
      const { error } = await signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message || "Failed to sign in");
        setIsLoading(false);
        return;
      }

      toast.success("Welcome back!");
      window.location.href = "/";
    } catch {
      toast.error("An error occurred during sign in");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://food-hub-backend-server.vercel.app";
      const callbackURL = `${window.location.origin}/`;

      // credentials:include stores the state cookie on the backend domain.
      // disableRedirect:true gets the Google URL as JSON (no auto-redirect).
      const res = await fetch(`${backendUrl}/api/auth/sign-in/social`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ provider: "google", callbackURL, disableRedirect: true }),
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No OAuth URL returned from backend");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  const fillDemoCreds = (role: 'customer' | 'provider' | 'admin') => {
    form.setValue("email", `${role}@example.com`);
    form.setValue("password", "password123");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: -20 }}
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
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to continue ordering delicious meals
            </p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="mb-6 rounded-xl bg-muted/50 p-4 border border-border">
                <p className="text-xs text-center text-muted-foreground font-medium mb-3 uppercase tracking-wider">
                  Quick Demo Login
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fillDemoCreds('customer')}
                    className="text-xs"
                  >
                    Customer
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fillDemoCreds('provider')}
                    className="text-xs"
                  >
                    Provider
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fillDemoCreds('admin')}
                    className="text-xs"
                  >
                    Admin
                  </Button>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="h-12"
                            {...field}
                          />
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
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-sm font-medium">Password</FormLabel>
                          <Link href="#" className="text-sm text-primary hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
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
                      Signing in...
                    </div>
                    <div className={cn("flex items-center justify-center transition-opacity", isLoading ? "opacity-0" : "opacity-100")}>
                      Sign In
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                </Button>
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
                  onClick={handleGoogleLogin}
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
                      New to FoodHub?
                    </span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link href="/register" className={cn(buttonVariants({ variant: "outline" }), "w-full h-12")}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create an Account
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right side - Visual */}
      <motion.div
        className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-20 left-20 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative z-10 max-w-md text-center px-8">
          <Badge variant="secondary" className="mb-6">
            Trusted by 500K+ Users
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Your Favorite Food,
            <span className="block text-gradient mt-2">Delivered Fast</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of food lovers who trust FoodHub for quick, reliable,
            and delicious meal deliveries.
          </p>

          {/* Floating Food Images */}
          <div className="flex justify-center gap-4">
            <motion.div
              className="h-24 w-24 rounded-2xl overflow-hidden shadow-xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&h=150&fit=crop"
                alt="Pizza"
                className="h-full w-full object-cover"
              />
            </motion.div>
            <motion.div
              className="h-24 w-24 rounded-2xl overflow-hidden shadow-xl mt-8"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop"
                alt="Burger"
                className="h-full w-full object-cover"
              />
            </motion.div>
            <motion.div
              className="h-24 w-24 rounded-2xl overflow-hidden shadow-xl"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=150&h=150&fit=crop"
                alt="Sushi"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
