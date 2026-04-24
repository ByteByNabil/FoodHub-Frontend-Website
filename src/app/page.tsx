"use client";

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
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const features = [
  {
    icon: Truck,
    title: "Lightning Fast Delivery",
    description: "Get your food delivered hot and fresh within 30 minutes or less.",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: ChefHat,
    title: "Top-Rated Chefs",
    description: "Partnered with award-winning restaurants and skilled culinary experts.",
    color: "bg-accent/10 text-accent"
  },
  {
    icon: Shield,
    title: "Secure & Easy Payments",
    description: "Multiple payment options with bank-level security protection.",
    color: "bg-chart-3/10 text-chart-3"
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description: "Quality ingredients sourced daily for the freshest meals.",
    color: "bg-chart-4/10 text-chart-4"
  },
];

const categories = [
  { name: "Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop", count: "50+ options" },
  { name: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop", count: "40+ options" },
  { name: "Sushi", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop", count: "35+ options" },
  { name: "Pasta", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop", count: "30+ options" },
  { name: "Salads", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop", count: "25+ options" },
  { name: "Desserts", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop", count: "45+ options" },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Food Enthusiast",
    content: "FoodHub has completely transformed how I order food. The variety is incredible, and delivery is always lightning fast!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "Michael Chen",
    role: "Busy Professional",
    content: "As someone who works 60+ hours a week, FoodHub is my go-to. The app is intuitive and the food quality is consistently excellent.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "Emily Rodriguez",
    role: "Mom of Three",
    content: "My kids love exploring new cuisines through FoodHub. It makes family dinners exciting and hassle-free!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },
];

const stats = [
  { value: "500K+", label: "Happy Customers" },
  { value: "1000+", label: "Restaurant Partners" },
  { value: "99%", label: "On-Time Delivery" },
  { value: "4.9", label: "App Rating" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-pulse-soft" />
        
        {/* Floating Food Images */}
        <div className="absolute top-32 right-[15%] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="animate-float"
          >
            <div className="h-32 w-32 rounded-2xl overflow-hidden shadow-2xl rotate-6">
              <img 
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop" 
                alt="Pizza"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-40 right-[25%] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="animate-float-delayed"
          >
            <div className="h-24 w-24 rounded-2xl overflow-hidden shadow-2xl -rotate-12">
              <img 
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop" 
                alt="Burger"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
        <div className="absolute top-48 left-[8%] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="animate-float"
          >
            <div className="h-28 w-28 rounded-2xl overflow-hidden shadow-2xl -rotate-6">
              <img 
                src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&h=200&fit=crop" 
                alt="Sushi"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="mx-auto max-w-4xl text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
                <Sparkles className="mr-2 h-4 w-4" />
                #1 Food Delivery App
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl"
            >
              Craving Something
              <span className="block mt-2 text-gradient">
                Delicious?
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="mb-10 text-pretty text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Discover thousands of restaurants and get your favorite meals 
              delivered to your door in minutes. Fresh, fast, and always delicious.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button size="lg" className="h-14 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all" asChild>
                <Link href="/meals">
                  Order Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base glass" asChild>
                <Link href="/providers">
                  <Play className="mr-2 h-4 w-4" />
                  Explore Restaurants
                </Link>
              </Button>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="var(--background)"/>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4">Popular Cuisines</Badge>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">Explore By Category</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From comfort food to exotic cuisines, find exactly what your taste buds desire
            </p>
          </motion.div>
          
          <motion.div 
            className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {categories.map((category) => (
              <motion.div key={category.name} variants={fadeInUp}>
                <Link href={`/meals?search=${category.name}`}>
                  <Card className="group cursor-pointer overflow-hidden border-0 shadow-md hover-lift">
                    <CardContent className="p-0">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                          <h3 className="font-semibold text-lg text-primary-foreground mb-1">
                            {category.name}
                          </h3>
                          <p className="text-xs text-primary-foreground/80">{category.count}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4">Why Us</Badge>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">The FoodHub Difference</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We go above and beyond to ensure every meal is a memorable experience
            </p>
          </motion.div>
          
          <motion.div 
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <Card className="h-full border-0 bg-card shadow-lg hover-lift">
                  <CardContent className="p-8">
                    <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.color}`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4">Simple Process</Badge>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Getting your favorite food delivered is easier than ever
            </p>
          </motion.div>
          
          <motion.div 
            className="grid gap-8 md:grid-cols-3"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { step: "01", title: "Browse & Select", description: "Explore hundreds of restaurants and menus. Find exactly what you&apos;re craving.", icon: UtensilsCrossed },
              { step: "02", title: "Place Your Order", description: "Customize your meal, add special instructions, and checkout securely.", icon: MapPin },
              { step: "03", title: "Enjoy Your Meal", description: "Track your order in real-time and enjoy fresh food at your doorstep.", icon: Clock },
            ].map((item, index) => (
              <motion.div key={item.step} variants={fadeInUp} className="relative">
                <div className="text-center">
                  <div className="relative inline-flex">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mx-auto mb-6">
                      <item.icon className="h-9 w-9 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">Loved By Thousands</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              See what our happy customers have to say about their FoodHub experience
            </p>
          </motion.div>
          
          <motion.div 
            className="grid gap-8 md:grid-cols-3"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {testimonials.map((testimonial) => (
              <motion.div key={testimonial.name} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover-lift">
                  <CardContent className="p-8">
                    <div className="mb-6 flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="mb-8 text-muted-foreground leading-relaxed text-lg">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 overflow-hidden rounded-full ring-2 ring-primary/20">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAyMGMtNC40MTggMC04LTMuNTgyLTgtOHMzLjU4Mi04IDgtOCA4IDMuNTgyIDggOC0zLjU4MiA4LTggOHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="mx-auto max-w-3xl text-center text-primary-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Users className="h-4 w-4" />
              Join 500,000+ Happy Customers
            </div>
            <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              Ready to Satisfy Your Cravings?
            </h2>
            <p className="mb-10 text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto">
              Download the app or order online now. Your next delicious meal is just a few taps away!
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-base shadow-xl" asChild>
                <Link href="/meals">
                  Start Ordering
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm" 
                asChild
              >
                <Link href="/register">Become a Partner</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
