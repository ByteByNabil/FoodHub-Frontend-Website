"use client";

import Link from "next/link";
import {
  MapPin,
  Store,
  Loader2,
  Star,
  Clock,
  ChefHat,
  Search,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ProvidersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: providersData, isLoading } = useSWR(
    "providers",
    () => api.getProviders(),
    { revalidateOnFocus: false },
  );

  const providers = providersData?.data || [];
  const filteredProviders = providers.filter(
    (provider) =>
      provider.restaurantName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      provider.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 lg:py-28 overflow-hidden">
        <div className="absolute top-10 right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 left-20 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

        {/* ── Right floating restaurant images ── */}
        <div className="absolute top-8 right-[8%] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="animate-float"
          >
            <div className="h-28 w-28 rounded-2xl overflow-hidden shadow-2xl rotate-6 ring-4 ring-background">
              {/* Cozy restaurant interior */}
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop" alt="Restaurant Interior" className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-[3%] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="animate-float-delayed"
          >
            <div className="h-20 w-20 rounded-2xl overflow-hidden shadow-xl -rotate-6 ring-4 ring-background">
              {/* Chef cooking */}
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop" alt="Chef Cooking" className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 right-[14%] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="animate-float"
          >
            <div className="h-24 w-24 rounded-2xl overflow-hidden shadow-2xl -rotate-12 ring-4 ring-background">
              {/* Fine dining table */}
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop" alt="Fine Dining" className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </div>

        {/* ── Left floating restaurant images ── */}
        <div className="absolute top-8 left-[8%] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="animate-float-delayed"
          >
            <div className="h-28 w-28 rounded-2xl overflow-hidden shadow-2xl -rotate-6 ring-4 ring-background">
              {/* Outdoor patio dining */}
              <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&h=200&fit=crop" alt="Outdoor Patio" className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 left-[3%] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="animate-float"
          >
            <div className="h-20 w-20 rounded-2xl overflow-hidden shadow-xl rotate-6 ring-4 ring-background">
              {/* Kitchen team */}
              <img src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=200&h=200&fit=crop" alt="Kitchen Team" className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-[14%] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="animate-float-delayed"
          >
            <div className="h-24 w-24 rounded-2xl overflow-hidden shadow-xl rotate-12 ring-4 ring-background">
              {/* Cafe ambiance */}
              <img src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=200&h=200&fit=crop" alt="Cafe Ambiance" className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-6">
              <ChefHat className="mr-2 h-4 w-4" />
              Partner Restaurants
            </Badge>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
              Discover Amazing
              <span className="block text-gradient mt-2">Restaurants</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
              Explore our curated collection of top-rated restaurants, each
              offering unique culinary experiences delivered right to your door.
            </p>

            {/* Search Bar */}
            <div className="flex max-w-xl mx-auto gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search restaurants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 text-base bg-background shadow-lg border-0"
                />
              </div>
              <Button
                size="lg"
                className="h-14 px-8 shadow-lg shadow-primary/25"
              >
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3 rounded-2xl border p-4 bg-card h-[380px]">
                  <Skeleton className="h-[200px] w-full rounded-xl" />
                  <div className="flex justify-between items-center mt-2">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="mt-auto pt-4 flex justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : filteredProviders.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">All Restaurants</h2>
                  <p className="text-muted-foreground mt-1">
                    {filteredProviders.length} restaurant
                    {filteredProviders.length !== 1 ? "s" : ""} available
                  </p>
                </div>
              </div>

              <motion.div
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                initial="initial"
                animate="animate"
                variants={staggerContainer}
              >
                {filteredProviders.map((provider) => (
                  <motion.div key={provider.id} variants={fadeInUp}>
                    <Link href={`/providers/${provider.id}`}>
                      <Card className="group h-full overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
                        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                          {/* Placeholder restaurant visual */}
                          {provider.image ? (
                            <img
                              src={provider.image}
                              alt={provider.restaurantName}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-background/90 shadow-lg">
                                  <Store className="h-10 w-10 text-primary" />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Status Badge */}
                          <Badge className="absolute right-3 top-3 bg-accent text-accent-foreground border-0 shadow-md">
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-accent-foreground animate-pulse" />
                            Open Now
                          </Badge>

                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="shadow-lg"
                            >
                              View Menu
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-1">
                              {provider.restaurantName}
                            </h3>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-medium">4.8</span>
                            </div>
                          </div>

                          {provider.description && (
                            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                              {provider.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-3 border-t border-border">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span className="line-clamp-1">
                                {provider.address}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>20-35 min</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : (
            <motion.div
              className="flex h-64 flex-col items-center justify-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
                <Store className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                No Restaurants Found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {searchQuery
                  ? `No restaurants match "${searchQuery}". Try a different search term.`
                  : "No restaurants are currently available. Check back soon!"}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
