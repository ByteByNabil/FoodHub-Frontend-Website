"use client";

import Link from "next/link";
import { 
  UtensilsCrossed, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Instagram,
  Twitter,
  Facebook,
  Youtube
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const quickLinks = [
  { href: "/meals", label: "Browse Meals" },
  { href: "/providers", label: "Restaurants" },
  { href: "/register", label: "Become a Partner" },
  { href: "/login", label: "Sign In" },
];

const supportLinks = [
  { href: "#", label: "Help Center" },
  { href: "#", label: "FAQ" },
  { href: "#", label: "Delivery Info" },
  { href: "#", label: "Refund Policy" },
];

const legalLinks = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
  { href: "#", label: "Cookie Policy" },
];

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAyMGMtNC40MTggMC04LTMuNTgyLTgtOHMzLjU4Mi04IDgtOCA4IDMuNTgyIDggOC0zLjU4MiA4LTggOHoiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+')]" />
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-background/10">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            <div className="text-center lg:text-left max-w-md">
              <h3 className="text-2xl font-bold mb-2">Stay in the Loop</h3>
              <p className="text-background/70">
                Subscribe to get exclusive offers, new restaurant alerts, and delicious deals.
              </p>
            </div>
            <div className="flex w-full max-w-md gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="h-12 bg-background/10 border-background/20 text-background placeholder:text-background/50 focus:border-background/40"
              />
              <Button 
                size="lg" 
                className="h-12 px-6 bg-background text-foreground hover:bg-background/90"
              >
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-lg transition-transform group-hover:scale-105">
                <UtensilsCrossed className="h-6 w-6 text-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">FoodHub</span>
                <span className="text-xs text-background/60">Delicious Delivered</span>
              </div>
            </Link>
            <p className="text-background/70 leading-relaxed max-w-sm">
              Your favorite restaurants and cuisines, delivered fast and fresh. 
              Experience the joy of great food at your doorstep.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/10 text-background/70 transition-all hover:bg-background/20 hover:text-background"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider text-background/50">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-background/70 transition-colors hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider text-background/50">
              Support
            </h4>
            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-background/70 transition-colors hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider text-background/50">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-background/70">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/10">
                  <Mail className="h-4 w-4" />
                </div>
                <span>support@foodhub.com</span>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/10">
                  <Phone className="h-4 w-4" />
                </div>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3 text-background/70">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/10 flex-shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>123 Food Street<br />Culinary City, FC 12345</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-background/60">
              &copy; {new Date().getFullYear()} FoodHub. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {legalLinks.map((link) => (
                <Link 
                  key={link.label}
                  href={link.href} 
                  className="text-sm text-background/60 transition-colors hover:text-background"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
