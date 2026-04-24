"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, User, LogOut, ChefHat, Shield, UtensilsCrossed, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/meals", label: "Meals" },
  { href: "/providers", label: "Restaurants" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, isCustomer, isProvider, isAdmin } = useAuth();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled 
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm" 
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
            <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight">FoodHub</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Delicious Delivered</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Cart - Only for customers */}
          {isCustomer && (
            <Link href="/cart" className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "relative h-11 w-11 rounded-xl",
                  totalItems > 0 && "bg-primary/10"
                )}
              >
                <ShoppingCart className={cn(
                  "h-5 w-5",
                  totalItems > 0 ? "text-primary" : "text-muted-foreground"
                )} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-lg"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>
          )}

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-11 w-11 rounded-xl bg-muted/50 hover:bg-muted"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <div className="px-3 py-3 mb-2 bg-muted/50 rounded-lg">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                  {isProvider && (
                    <Badge variant="secondary" className="mt-2">
                      <ChefHat className="mr-1 h-3 w-3" />
                      Restaurant Owner
                    </Badge>
                  )}
                  {isAdmin && (
                    <Badge variant="secondary" className="mt-2">
                      <Shield className="mr-1 h-3 w-3" />
                      Administrator
                    </Badge>
                  )}
                </div>
                <DropdownMenuSeparator />

                {/* Customer Links */}
                {isCustomer && (
                  <>
                    <DropdownMenuItem asChild className="py-2.5 cursor-pointer">
                      <Link href="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-2.5 cursor-pointer">
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                  </>
                )}

                {/* Provider Links */}
                {isProvider && (
                  <>
                    <DropdownMenuItem asChild className="py-2.5 cursor-pointer">
                      <Link href="/provider/dashboard" className="flex items-center gap-2">
                        <ChefHat className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-2.5 cursor-pointer">
                      <Link href="/provider/menu">Manage Menu</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-2.5 cursor-pointer">
                      <Link href="/provider/orders">Orders</Link>
                    </DropdownMenuItem>
                  </>
                )}

                {/* Admin Links */}
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild className="py-2.5 cursor-pointer">
                      <Link href="/admin" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-2.5 cursor-pointer">
                      <Link href="/admin/users">Manage Users</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-2.5 cursor-pointer">
                      <Link href="/admin/orders">All Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-2.5 cursor-pointer">
                      <Link href="/admin/categories">Categories</Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSignOut} 
                  className="py-2.5 text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Button variant="ghost" className="h-11 px-5" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button className="h-11 px-5 shadow-lg shadow-primary/25" asChild>
                <Link href="/register">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Started
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-xl md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border md:hidden bg-background/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col gap-2">
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-3 rounded-xl text-base font-medium transition-colors",
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <>
                    <div className="my-2 border-t border-border" />
                    <Link
                      href="/login"
                      className="px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Button className="mt-2 h-12" asChild>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
