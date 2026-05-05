"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  MapPin,
  Star,
  Truck,
  Shield,
  UtensilsCrossed,
  Sparkles,
  ChefHat,
  Leaf,
  Users,
  Play,
  Mail,
  Store,
  Bike
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const features = [
  {
    icon: Truck,
    title: "Lightning Fast Delivery",
    description: "Get your food delivered hot and fresh within 30 minutes or less.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: ChefHat,
    title: "Top-Rated Chefs",
    description: "Partnered with award-winning restaurants and skilled culinary experts.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Shield,
    title: "Secure & Easy Payments",
    description: "Multiple payment options with bank-level security protection.",
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description: "Quality ingredients sourced daily for the freshest meals.",
    color: "bg-chart-4/10 text-chart-4",
  },
];

const categories = [
  {
    name: "Pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop",
    count: "50+ options",
  },
  {
    name: "Burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop",
    count: "40+ options",
  },
  {
    name: "Sushi",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop",
    count: "35+ options",
  },
  {
    name: "Pasta",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop",
    count: "30+ options",
  },
  {
    name: "Salads",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop",
    count: "25+ options",
  },
  {
    name: "Desserts",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop",
    count: "45+ options",
  },
  {
    name: "Tacos",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=400&fit=crop",
    count: "20+ options",
  },
  {
    name: "Indian",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop",
    count: "40+ options",
  },
  {
    name: "Vegan",
    image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&h=400&fit=crop",
    count: "15+ options",
  },
  {
    name: "Sandwiches",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop",
    count: "35+ options",
  },
  {
    name: "Chinese",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop",
    count: "55+ options",
  },
  {
    name: "BBQ",
    image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=400&fit=crop",
    count: "25+ options",
  },
];

const trendingMeals = [
  {
    name: "Spicy Pepperoni Pizza",
    restaurant: "Luigi's Pizzeria",
    price: 18.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=400&fit=crop",
  },
  {
    name: "Double Smash Burger",
    restaurant: "Burger Joint",
    price: 14.50,
    rating: 4.9,
    image: "https://assets.wsimgs.com/wsimgs/rk/images/dp/recipe/202531/0004/img6l.jpg",
  },
  {
    name: "Dragon Sushi Roll",
    restaurant: "Tokyo Express",
    price: 22.00,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=500&h=400&fit=crop",
  },
  {
    name: "Vegan Buddha Bowl",
    restaurant: "Green Leaf",
    price: 16.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Food Enthusiast",
    content: "FoodHub has completely transformed how I order food. The variety is incredible, and delivery is always lightning fast!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Michael Chen",
    role: "Busy Professional",
    content: "As someone who works 60+ hours a week, FoodHub is my go-to. The app is intuitive and the food quality is consistently excellent.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Emily Rodriguez",
    role: "Mom of Three",
    content: "My kids love exploring new cuisines through FoodHub. It makes family dinners exciting and hassle-free!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
];

const stats = [
  { value: "500K+", label: "Happy Customers" },
  { value: "1000+", label: "Restaurant Partners" },
  { value: "99%", label: "On-Time Delivery" },
  { value: "4.9", label: "App Rating" },
];

export default function HomePage() {
  const [categoryPage, setCategoryPage] = useState(1);
  const categoriesPerPage = 6;
  const totalCategoryPages = Math.ceil(categories.length / categoriesPerPage);
  const currentCategories = categories.slice(
    (categoryPage - 1) * categoriesPerPage,
    categoryPage * categoriesPerPage
  );
  return (
    <div className="flex flex-col overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-pulse-soft" />

        {/* ── Right-side floating images ── */}
        <div className="absolute top-28 right-[12%] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 6 }}
            animate={{ opacity: 1, scale: 1, rotate: 6 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="animate-float"
          >
            <div className="h-32 w-32 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-background">
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop" alt="Pizza" className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </div>

        <div className="absolute top-56 right-[4%] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="animate-float-delayed"
          >
            <div className="h-24 w-24 rounded-2xl overflow-hidden shadow-xl -rotate-6 ring-4 ring-background">
              <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=200&fit=crop" alt="Dessert" className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-36 right-[20%] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="animate-float"
          >
            <div className="h-28 w-28 rounded-2xl overflow-hidden shadow-2xl -rotate-12 ring-4 ring-background">
              <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop" alt="Burger" className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </div>

        {/* ── Left-side floating images ── */}
        <div className="absolute top-32 left-[8%] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="animate-float-delayed"
          >
            <div className="h-28 w-28 rounded-2xl overflow-hidden shadow-2xl rotate-12 ring-4 ring-background">
              <img src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&h=200&fit=crop" alt="Sushi" className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </div>

        <div className="absolute top-60 left-[2%] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="animate-float"
          >
            <div className="h-20 w-20 rounded-2xl overflow-hidden shadow-xl -rotate-6 ring-4 ring-background">
              <img src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=200&h=200&fit=crop" alt="Tacos" className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-32 left-[12%] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="animate-float-delayed"
          >
            <div className="h-24 w-24 rounded-2xl overflow-hidden shadow-xl rotate-6 ring-4 ring-background">
              <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop" alt="Salad" className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 relative z-10 py-12 md:py-24">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
                <Sparkles className="mr-2 h-4 w-4" />
                #1 Premium Food Delivery
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mb-6 text-balance text-5xl font-extrabold tracking-tight md:text-7xl"
            >
              Craving Something
              <span className="block mt-2 text-gradient">Extraordinary?</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mb-10 text-pretty text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Discover thousands of local restaurants and get your favorite meals
              delivered to your door in minutes. Fresh, fast, and remarkably delicious.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button size="lg" className="h-14 px-8 text-base shadow-lg hover:shadow-xl transition-all" asChild>
                <Link href="/meals">
                  Order Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base glass" asChild>
                <Link href="/providers">
                  <Play className="mr-2 h-4 w-4" /> Explore Restaurants
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="var(--background)" />
          </svg>
        </div>
      </section>

      {/* 2. Live Stats Banner */}
      <section className="py-12 bg-background border-b border-border/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 md:gap-16 lg:gap-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-24 bg-muted/20" id="about">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">Simple Process</Badge>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">How FoodHub Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Getting your favorite food delivered is easier than ever with our streamlined process.
            </p>
          </motion.div>

          <div className="grid gap-12 md:grid-cols-3 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/30 via-primary/30 to-transparent border-t-2 border-dashed border-primary/20 z-0" />
            {[
              { step: "01", title: "Browse & Select", description: "Explore hundreds of restaurants and menus to find exactly what you're craving.", icon: UtensilsCrossed },
              { step: "02", title: "Place Your Order", description: "Customize your meal, add special instructions, and checkout securely.", icon: MapPin },
              { step: "03", title: "Enjoy Your Meal", description: "Track your order in real-time and enjoy fresh food right at your doorstep.", icon: Clock },
            ].map((item, index) => (
              <motion.div key={item.step} className="relative z-10 text-center bg-card p-8 rounded-3xl shadow-sm border border-border/50 hover-lift"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative inline-flex mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shadow-inner">
                    <item.icon className="h-10 w-10 text-primary" />
                  </div>
                  <span className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md">
                    {item.step}
                  </span>
                </div>
                <h3 className="mb-3 text-2xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Categories */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <Badge variant="outline" className="mb-4">Popular Cuisines</Badge>
              <h2 className="text-4xl font-bold md:text-5xl">Explore By Category</h2>
            </div>
            <Button variant="ghost" className="hidden md:flex" asChild>
              <Link href="/meals">View All Categories <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8">
            {currentCategories.map((category, index) => (
              <motion.div key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/meals?search=${category.name}`}>
                  <Card className="group cursor-pointer overflow-hidden border-0 shadow-md hover-lift h-full">
                    <CardContent className="p-0 h-full relative">
                      <div className="relative aspect-square overflow-hidden">
                        <img src={category.image} alt={category.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
                          <h3 className="font-bold text-xl text-white mb-1 tracking-tight">{category.name}</h3>
                          <p className="text-xs text-white/80 font-medium">{category.count}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalCategoryPages > 1 && (
            <div className="flex justify-center items-center gap-2 mb-8 hidden md:flex">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCategoryPage((p) => Math.max(1, p - 1))}
                disabled={categoryPage === 1}
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalCategoryPages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={categoryPage === i + 1 ? "default" : "ghost"}
                    size="icon"
                    className="w-8 h-8 rounded-full"
                    onClick={() => setCategoryPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCategoryPage((p) => Math.min(totalCategoryPages, p + 1))}
                disabled={categoryPage === totalCategoryPages}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button variant="outline" className="w-full md:hidden" asChild>
            <Link href="/meals">View All Categories</Link>
          </Button>
        </div>
      </section>

      {/* 5. Trending Meals */}
      <section className="py-24 bg-muted/10 border-y border-border/50">
        <div className="container mx-auto px-4">
          <motion.div className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 text-accent border-accent">Trending Now</Badge>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">Most Ordered Meals</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Dishes our community can't get enough of this week.</p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {trendingMeals.map((meal, index) => (
              <motion.div key={meal.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg hover-lift group bg-background">
                  <div className="relative h-48 overflow-hidden">
                    <img src={meal.image} alt={meal.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold flex items-center shadow-sm">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400 mr-1" /> {meal.rating}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">{meal.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{meal.restaurant}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">${meal.price.toFixed(2)}</span>
                      <Button size="sm" className="rounded-full px-4 font-semibold" asChild>
                        <Link href="/meals">Order</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Core Features / Services */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">Why Us</Badge>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">The FoodHub Difference</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We go above and beyond to ensure every meal is a memorable experience.</p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border border-border/50 bg-card shadow-sm hover-lift hover:border-primary/30 transition-colors">
                  <CardContent className="p-8">
                    <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.color}`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Become a Partner */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900">
        {/* subtle texture */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&h=600&fit=crop')] opacity-[0.07] mix-blend-luminosity" />
        {/* Soft glow blobs */}
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm font-medium text-white/80 mb-6 backdrop-blur-sm">
                🤝 Partner with us
              </span>
              <h2 className="text-4xl font-extrabold mb-6 md:text-5xl text-white leading-tight">
                Grow your business<br className="hidden sm:block" /> with FoodHub
              </h2>
              <p className="text-white/70 text-lg mb-8 leading-relaxed max-w-lg">
                Partner with us to reach more customers, increase your revenue, and manage deliveries effortlessly. Join our network of successful restaurants today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg"
                  className="bg-white text-slate-900 hover:bg-white/90 shadow-xl font-semibold"
                  asChild>
                  <Link href="/register"><Store className="mr-2 h-5 w-5" /> Register Restaurant</Link>
                </Button>
                <Button size="lg" variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                  asChild>
                  <Link href="/register"><Bike className="mr-2 h-5 w-5" /> Become a Rider</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div className="hidden lg:grid grid-cols-2 gap-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/8 backdrop-blur-md border border-white/15 p-8 rounded-3xl text-center shadow-xl">
                <div className="text-4xl font-bold mb-2 text-white">30%</div>
                <div className="text-sm font-medium uppercase tracking-wider text-white/60">Average Revenue Increase</div>
              </div>
              <div className="bg-white/8 backdrop-blur-md border border-white/15 p-8 rounded-3xl text-center translate-y-8 shadow-xl">
                <div className="text-4xl font-bold mb-2 text-white">5M+</div>
                <div className="text-sm font-medium uppercase tracking-wider text-white/60">Active App Users</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">Loved By Thousands</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">See what our happy customers have to say about their FoodHub experience.</p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover-lift bg-card relative">
                  <div className="absolute top-6 right-8 text-primary/10">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.017 21L16.411 14.504L16.425 14.471C16.892 13.398 17.151 12.213 17.151 10.963C17.151 6.568 13.583 3 9.188 3C4.793 3 1.225 6.568 1.225 10.963C1.225 15.358 4.793 18.926 9.188 18.926C9.645 18.926 10.091 18.887 10.523 18.812L8.141 21H14.017ZM22.775 21L25.169 14.504L25.183 14.471C25.65 13.398 25.909 12.213 25.909 10.963C25.909 6.568 22.341 3 17.946 3C13.551 3 9.983 6.568 9.983 10.963C9.983 15.358 13.551 18.926 17.946 18.926C18.403 18.926 18.849 18.887 19.281 18.812L16.899 21H22.775Z" />
                    </svg>
                  </div>
                  <CardContent className="p-8">
                    <div className="mb-6 flex gap-1 relative z-10">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="mb-8 text-muted-foreground leading-relaxed text-lg relative z-10">"{testimonial.content}"</p>
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="h-14 w-14 overflow-hidden rounded-full ring-2 ring-primary/20">
                        <img src={testimonial.avatar} alt={testimonial.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground font-medium">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">Support</Badge>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">Everything you need to know about the product and billing.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm"
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary">How fast is the delivery?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Our standard delivery time is between 20-40 minutes depending on your location and the restaurant's preparation time. You can track your rider in real-time on the app.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary">What payment methods do you accept?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  We accept all major credit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and PayPal. All transactions are securely processed and encrypted.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary">Can I schedule an order in advance?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Yes! You can schedule deliveries up to 2 days in advance. Just select "Schedule Order" during checkout and pick your preferred date and time window.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary">How do I become a partner restaurant?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Simply click the "Become a Partner" button above, fill out the registration form, and our onboarding team will contact you within 24 hours to get you set up.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* 10. Newsletter & Final CTA Section */}
      <section className="relative py-24 overflow-hidden border-t border-border/50">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="mx-auto max-w-4xl bg-card border border-border shadow-2xl rounded-[2.5rem] p-8 md:p-16 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 mx-auto inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-4 text-3xl font-extrabold md:text-5xl tracking-tight">
              Get <span className="text-primary">20% Off</span> Your First Order
            </h2>
            <p className="mb-10 text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Subscribe to our newsletter to receive exclusive discounts, updates on new restaurants, and secret menu drops.
            </p>

            <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Enter your email address"
                className="h-14 rounded-full px-6 text-base shadow-inner bg-background border-border"
                required
              />
              <Button size="lg" className="h-14 rounded-full px-8 text-base shadow-lg shrink-0">
                Subscribe Now
              </Button>
            </form>
            <p className="mt-4 text-xs text-muted-foreground font-medium">We respect your privacy. Unsubscribe at any time.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
