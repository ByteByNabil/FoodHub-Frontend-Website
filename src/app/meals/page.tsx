"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, X, Loader2, SlidersHorizontal, UtensilsCrossed, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MealCard } from "@/components/meal-card";
import { api } from "@/lib/api";
import type { Category, MealFilters } from "@/lib/types";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

function MealsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [filters, setFilters] = useState<MealFilters>({
    search: searchParams.get("search") || "",
    categoryId: searchParams.get("categoryId") || "",
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    page: 1,
    limit: 12,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: mealsData, isLoading } = useSWR(
    ["meals", filters],
    () => api.getMeals(filters),
    { revalidateOnFocus: false }
  );

  const { data: categoriesData } = useSWR(
    "categories",
    () => api.getCategories(),
    { revalidateOnFocus: false }
  );

  const meals = mealsData?.data?.data || [];
  const meta = mealsData?.data?.meta;
  const categories: Category[] = categoriesData?.data || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters = { ...filters, search, page: 1 };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleFilterChange = (key: keyof MealFilters, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const clearFilters = () => {
    const newFilters: MealFilters = { page: 1, limit: 12 };
    setFilters(newFilters);
    setSearch("");
    router.push("/meals");
  };

  const updateURL = (newFilters: MealFilters) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.categoryId) params.set("categoryId", newFilters.categoryId);
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice.toString());
    router.push(`/meals?${params.toString()}`);
  };

  const hasActiveFilters = filters.categoryId || filters.minPrice || filters.maxPrice || filters.search;
  const activeFilterCount = [filters.categoryId, filters.minPrice || filters.maxPrice, filters.search].filter(Boolean).length;

  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam && searchParam !== filters.search) {
      setSearch(searchParam);
      setFilters((prev) => ({ ...prev, search: searchParam }));
    }
  }, [searchParams, filters.search]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 lg:py-24">
        <div className="absolute top-10 right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 left-20 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="mr-2 h-4 w-4" />
              Curated Selection
            </Badge>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
              Find Your Perfect
              <span className="block text-gradient mt-2">Meal</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
              Browse hundreds of delicious dishes from our partner restaurants. 
              Filter by cuisine, price, and more.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex max-w-2xl mx-auto gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for dishes, cuisines, or restaurants..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-14 pl-12 text-base bg-background shadow-lg border-0"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 shadow-lg shadow-primary/25">
                Search
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filter Bar */}
          <motion.div 
            className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">All Meals</h2>
              {!isLoading && (
                <Badge variant="outline" className="text-muted-foreground">
                  {meta?.total || meals.length} results
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Desktop Filters */}
              <div className="hidden items-center gap-3 md:flex">
                <Select
                  value={filters.categoryId || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("categoryId", value === "all" ? undefined : value)
                  }
                >
                  <SelectTrigger className="w-[180px] h-11 bg-background shadow-sm">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={
                    filters.maxPrice
                      ? `${filters.minPrice || 0}-${filters.maxPrice}`
                      : "all"
                  }
                  onValueChange={(value) => {
                    if (value === "all") {
                      handleFilterChange("minPrice", undefined);
                      handleFilterChange("maxPrice", undefined);
                    } else {
                      const [min, max] = value.split("-").map(Number);
                      setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max, page: 1 }));
                      updateURL({ ...filters, minPrice: min, maxPrice: max, page: 1 });
                    }
                  }}
                >
                  <SelectTrigger className="w-[150px] h-11 bg-background shadow-sm">
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Price</SelectItem>
                    <SelectItem value="0-10">Under $10</SelectItem>
                    <SelectItem value="10-20">$10 - $20</SelectItem>
                    <SelectItem value="20-30">$20 - $30</SelectItem>
                    <SelectItem value="30-50">$30 - $50</SelectItem>
                    <SelectItem value="50-100">$50+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-11 md:hidden relative">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[320px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filters
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 space-y-8">
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Category</Label>
                      <Select
                        value={filters.categoryId || "all"}
                        onValueChange={(value) => {
                          handleFilterChange("categoryId", value === "all" ? undefined : value);
                          setIsFilterOpen(false);
                        }}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Price Range</Label>
                      <Select
                        value={
                          filters.maxPrice
                            ? `${filters.minPrice || 0}-${filters.maxPrice}`
                            : "all"
                        }
                        onValueChange={(value) => {
                          if (value === "all") {
                            setFilters((prev) => ({
                              ...prev,
                              minPrice: undefined,
                              maxPrice: undefined,
                              page: 1,
                            }));
                          } else {
                            const [min, max] = value.split("-").map(Number);
                            setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max, page: 1 }));
                          }
                          setIsFilterOpen(false);
                        }}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Any Price" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any Price</SelectItem>
                          <SelectItem value="0-10">Under $10</SelectItem>
                          <SelectItem value="10-20">$10 - $20</SelectItem>
                          <SelectItem value="20-30">$20 - $30</SelectItem>
                          <SelectItem value="30-50">$30 - $50</SelectItem>
                          <SelectItem value="50-100">$50+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {hasActiveFilters && (
                      <Button 
                        variant="outline" 
                        className="w-full h-12"
                        onClick={() => {
                          clearFilters();
                          setIsFilterOpen(false);
                        }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="hidden md:flex text-muted-foreground hover:text-foreground"
                >
                  <X className="mr-1 h-4 w-4" />
                  Clear filters
                </Button>
              )}
            </div>
          </motion.div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-64 items-center justify-center"
              >
                <div className="text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Finding delicious meals...</p>
                </div>
              </motion.div>
            ) : meals.length > 0 ? (
              <motion.div
                key="results"
                initial="initial"
                animate="animate"
                variants={staggerContainer}
              >
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {meals.map((meal, index) => (
                    <motion.div
                      key={meal.id}
                      variants={fadeInUp}
                      transition={{ delay: index * 0.05 }}
                    >
                      <MealCard meal={meal} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {meta && meta.totalPage > 1 && (
                  <motion.div 
                    className="mt-12 flex items-center justify-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 px-6"
                      disabled={meta.page === 1}
                      onClick={() => handleFilterChange("page", meta.page - 1)}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-2 px-4">
                      <span className="text-sm text-muted-foreground">
                        Page <span className="font-semibold text-foreground">{meta.page}</span> of{" "}
                        <span className="font-semibold text-foreground">{meta.totalPage}</span>
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 px-6"
                      disabled={meta.page === meta.totalPage}
                      onClick={() => handleFilterChange("page", meta.page + 1)}
                    >
                      Next
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-64 flex-col items-center justify-center text-center"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
                  <UtensilsCrossed className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Meals Found</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Try adjusting your search or filters to discover more options.
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

export default function MealsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <MealsContent />
    </Suspense>
  );
}
