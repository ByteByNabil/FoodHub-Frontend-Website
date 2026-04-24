"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UtensilsCrossed, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message || "Failed to sign in");
        return;
      }

      toast.success("Welcome back!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
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
            <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-12"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link 
                      href="#" 
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="h-12 pr-12"
                      required
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
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base shadow-lg shadow-primary/25" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-4 text-muted-foreground">
                      New to FoodHub?
                    </span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link href="/register">
                    <Button variant="outline" className="w-full h-12">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create an Account
                    </Button>
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
            Join thousands of food lovers who trust FoodHub for quick, 
            reliable, and delicious meal deliveries.
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
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
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
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
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
