"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem, Meal } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  addToCart: (meal: Meal, quantity?: number) => void;
  removeFromCart: (mealId: string) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  providerId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "foodhub_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const providerId = items.length > 0 ? items[0].meal.providerId : null;

  const addToCart = (meal: Meal, quantity = 1) => {
    setItems((prevItems) => {
      // Check if meal is from a different provider
      if (prevItems.length > 0 && prevItems[0].meal.providerId !== meal.providerId) {
        // Clear cart and add new item from different provider
        return [{ meal, quantity }];
      }

      // Check if meal already exists in cart
      const existingItem = prevItems.find((item) => item.meal.id === meal.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.meal.id === meal.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { meal, quantity }];
    });
  };

  const removeFromCart = (mealId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.meal.id !== mealId));
  };

  const updateQuantity = (mealId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(mealId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.meal.id === mealId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.meal.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        providerId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
