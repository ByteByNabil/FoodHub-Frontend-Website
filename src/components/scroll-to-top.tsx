"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="scroll-to-top"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="fixed bottom-24 right-5 z-40 sm:bottom-28 sm:right-6"
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            aria-label="Scroll to top"
            className="h-12 w-12 rounded-full shadow-lg shadow-primary/30 bg-gradient-to-br from-primary to-accent text-white hover:opacity-90 hover:scale-105 hover:shadow-primary/50 transition-all duration-200 border-0"
          >
            <ArrowUp className="h-5 w-5 text-white" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
