"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { API_BASE_URL } from "@/lib/api-url";

// Simple inline markdown renderer - handles **bold** and bullet lists
function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        // Handle bullet points
        const isBullet = /^[-*•]\s/.test(line);
        const text = isBullet ? line.replace(/^[-*•]\s/, "") : line;
        // Handle **bold**
        const parts = text.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
          if (/^\*\*[^*]+\*\*$/.test(part)) {
            return <strong key={j} className="font-semibold text-foreground/90">{part.slice(2, -2)}</strong>;
          }
          return part;
        });
        if (!text.trim()) return <div key={i} className="h-1" />;
        return isBullet ? (
          <div key={i} className="flex gap-2 items-start">
            <span className="text-primary mt-0.5">•</span>
            <span className="flex-1">{parts}</span>
          </div>
        ) : (
          <p key={i}>{parts}</p>
        );
      })}
    </div>
  );
}

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm Foodie, your AI culinary assistant. Looking for a spicy dinner or a vegan dessert? Just ask!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMsg],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! My brain is a little scrambled right now. Please check my API key or try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 hover-lift"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="icon"
              className="h-14 w-14 rounded-full shadow-lg shadow-primary/30 bg-gradient-to-r from-primary to-accent hover:shadow-primary/50 transition-all border border-white/20"
            >
              <MessageSquare className="h-6 w-6 text-white" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 w-[360px] md:w-[380px] shadow-2xl"
          >
            <Card className="flex h-[520px] flex-col overflow-hidden glass-card rounded-2xl border-border/50">
              <CardHeader className="bg-gradient-to-r from-primary to-accent px-5 py-4 text-white shrink-0 shadow-sm relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-medium tracking-wide">
                    <Sparkles className="h-5 w-5 text-white animate-pulse-soft" />
                    Ask Foodie
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-white hover:bg-white/20 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-0 bg-background/40 backdrop-blur-md">
                <ScrollArea className="h-full px-4 py-5">
                  <div className="flex flex-col gap-4 min-h-[400px]">
                    <AnimatePresence initial={false}>
                      {messages.map((msg, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex w-fit max-w-[85%] flex-col gap-1 rounded-2xl px-4 py-2.5 text-[14.5px] leading-relaxed shadow-sm break-words ${
                            msg.role === "user"
                              ? "ml-auto bg-gradient-to-br from-primary to-accent text-white rounded-br-[4px] shadow-primary/20"
                              : "bg-secondary border border-border/50 text-secondary-foreground rounded-bl-[4px]"
                          }`}
                        >
                          {msg.role === "assistant" ? (
                            <SimpleMarkdown content={msg.content} />
                          ) : (
                            msg.content
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {isLoading && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex w-fit max-w-[80%] rounded-2xl rounded-bl-[4px] bg-secondary border border-border/50 px-4 py-3 text-sm shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span className="text-secondary-foreground/70 font-medium">Foodie is typing...</span>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} className="h-2" />
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="border-t border-border/40 bg-background/80 backdrop-blur-xl p-3 shrink-0 relative z-10">
                <form
                  className="flex w-full items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                >
                  <Input
                    placeholder="Ask about our meals..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 bg-background border-border/60 focus-visible:ring-primary shadow-sm rounded-xl h-11"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isLoading}
                    className="shrink-0 h-11 w-11 rounded-xl shadow-md bg-gradient-to-br from-primary to-accent hover:opacity-90 text-white transition-all disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
