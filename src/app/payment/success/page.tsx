"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/cart-context";

const CONFETTI_COLORS = [
  "#f87171",
  "#fbbf24",
  "#34d399",
  "#60a5fa",
  "#a78bfa",
  "#f472b6",
];

type ConfettiPiece = {
  id: number;
  left: string;
  animationDelay: string;
  animationDuration: string;
  backgroundColor: string;
};

export default function PaymentSuccessPage() {
  const [confetti, setConfetti] = useState(false);
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart immediately from localStorage (bypasses hydration timing)
    localStorage.removeItem("foodhub_cart");
    // Also clear the in-memory cart state
    clearCart();

    const generatedPieces = Array.from({ length: 50 }, (_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${3 + Math.random() * 2}s`,
      backgroundColor:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    }));

    setPieces(generatedPieces);
    setConfetti(true);

    // Hide confetti animation after 3 seconds
    const timer = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
      <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      {/* Confetti Animation */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {pieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute animate-confetti"
              style={{
                left: piece.left,
                animationDelay: piece.animationDelay,
                animationDuration: piece.animationDuration,
              }}
            >
              <div
                className="h-3 w-3 rotate-45"
                style={{
                  backgroundColor: piece.backgroundColor,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for your order! Your payment has been processed successfully.
          </p>
          
          <div className="rounded-lg bg-muted p-4 space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Package className="h-4 w-4 text-primary" />
              <span>Your order is being prepared</span>
            </div>
            <div className="text-xs text-muted-foreground">
              You will receive a confirmation email shortly with your order details.
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">Order confirmed</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button asChild className="w-full" size="lg">
            <Link href="/orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              View My Orders
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
}
