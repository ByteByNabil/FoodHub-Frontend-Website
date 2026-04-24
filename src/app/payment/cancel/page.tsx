"use client";

import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your payment was not completed. Your order has been saved and you can try again anytime.
          </p>
          
          <div className="rounded-lg bg-muted p-4 space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              <span>Common reasons for cancellation:</span>
            </div>
            <ul className="text-xs text-muted-foreground text-left space-y-1 pl-4">
              <li>- Browser was closed during payment</li>
              <li>- Payment session expired</li>
              <li>- Card was declined</li>
              <li>- Manual cancellation</li>
            </ul>
          </div>

          <div className="text-sm text-muted-foreground">
            No charges have been made to your account.
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button asChild className="w-full" size="lg">
            <Link href="/orders">
              <RefreshCw className="mr-2 h-4 w-4" />
              View Orders & Retry Payment
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/meals">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
