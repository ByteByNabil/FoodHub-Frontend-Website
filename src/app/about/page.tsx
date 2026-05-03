import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Users, TrendingUp, Heart } from "lucide-react";

export const metadata = {
  title: "About Us - FoodHub",
  description: "Learn more about FoodHub's mission to connect people with great local food.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-muted py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiMwMDAiLz48L3N2Zz4=')] [background-size:20px_20px]" />
        </div>
        <div className="container relative z-10 mx-auto max-w-4xl text-center">
          <Badge className="mb-4 text-sm font-medium px-3 py-1">Our Story</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Connecting People Through <span className="text-primary">Great Food</span>
          </h1>
          <p className="text-xl text-muted-foreground md:px-16 leading-relaxed">
            FoodHub was founded with a simple belief: everyone deserves easy access to high-quality, delicious meals from their favorite local restaurants, delivered fresh and fast.
          </p>
        </div>
      </section>

      {/* Mission & Stats */}
      <section className="py-20 px-4 container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-muted-foreground mb-4 text-lg">
              We're on a mission to empower local businesses and delight customers by building the most seamless, transparent, and rewarding food delivery ecosystem.
            </p>
            <p className="text-muted-foreground text-lg mb-6">
              Whether you're a family looking for a quick dinner, a student pulling an all-nighter, or a small restaurant owner aiming to reach more customers, FoodHub is built for you.
            </p>
            <Button size="lg" asChild>
              <Link href="/register">Join the Platform</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex flex-col items-center text-center">
              <Users className="h-10 w-10 text-primary mb-4" />
              <div className="text-3xl font-bold mb-1">50k+</div>
              <div className="text-sm text-muted-foreground font-medium">Happy Customers</div>
            </div>
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex flex-col items-center text-center">
              <UtensilsCrossed className="h-10 w-10 text-primary mb-4" />
              <div className="text-3xl font-bold mb-1">1,200+</div>
              <div className="text-sm text-muted-foreground font-medium">Restaurant Partners</div>
            </div>
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex flex-col items-center text-center">
              <TrendingUp className="h-10 w-10 text-primary mb-4" />
              <div className="text-3xl font-bold mb-1">2M+</div>
              <div className="text-sm text-muted-foreground font-medium">Orders Delivered</div>
            </div>
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex flex-col items-center text-center">
              <Heart className="h-10 w-10 text-primary mb-4" />
              <div className="text-3xl font-bold mb-1">4.9/5</div>
              <div className="text-sm text-muted-foreground font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-card border-y py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">What Drives Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community First</h3>
              <p className="text-muted-foreground">We prioritize local businesses, ensuring a fair, transparent platform that helps our neighborhoods thrive.</p>
            </div>
            <div className="p-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <UtensilsCrossed className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Uncompromised</h3>
              <p className="text-muted-foreground">From the ingredients to the delivery bag, we strive for excellence in every single order.</p>
            </div>
            <div className="p-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Continuous Innovation</h3>
              <p className="text-muted-foreground">We constantly improve our technology to make ordering faster, easier, and more enjoyable.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full bg-primary/10 text-primary ${className}`}>
      {children}
    </span>
  );
}
