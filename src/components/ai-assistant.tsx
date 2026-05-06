"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Sparkles,
  Trash2,
  ChevronDown,
  Bot,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { API_BASE_URL } from "@/lib/api-url";

/* ─── Markdown renderer ─────────────────────────────────────────────── */
function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const isBullet = /^[-*•]\s/.test(line);
        const text = isBullet ? line.replace(/^[-*•]\s/, "") : line;
        const parts = text.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
          /^\*\*[^*]+\*\*$/.test(part) ? (
            <strong key={j} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          ) : (
            part
          )
        );
        if (!text.trim()) return <div key={i} className="h-1" />;
        return isBullet ? (
          <div key={i} className="flex gap-2 items-start">
            <span className="text-primary mt-0.5 shrink-0">•</span>
            <span className="flex-1">{parts}</span>
          </div>
        ) : (
          <p key={i}>{parts}</p>
        );
      })}
    </div>
  );
}

/* ─── Types ─────────────────────────────────────────────────────────── */
type Message = {
  role: "user" | "assistant";
  content: string;
  time: string;
};

const QUICK_PROMPTS = [
  "🍕 Best pizza?",
  "🥗 Vegan options",
  "🔥 Spicy dishes",
  "⚡ Fast delivery",
  "💰 Budget meals",
  "🍣 Sushi near me",
];

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ─── Component ─────────────────────────────────────────────────────── */
export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! 👋 I'm **Foodie**, your AI culinary assistant.\n\nLooking for a spicy dinner, a vegan dessert, or the best pizza in town? Just ask me anything!",
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom("instant");
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", content: trimmed, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, time: getTime() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Oops! Something went wrong on my end. Please try again in a moment. 🙏",
          time: getTime(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! How can I help you find your next favourite meal? 😊",
        time: getTime(),
      },
    ]);
  };

  return (
    <>
      {/* ── FAB ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6"
          >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping opacity-75 pointer-events-none" />
            <Button
              onClick={() => setIsOpen(true)}
              size="icon"
              aria-label="Open Foodie AI Assistant"
              className="relative h-14 w-14 rounded-full shadow-xl shadow-primary/30 bg-gradient-to-br from-primary to-accent hover:shadow-primary/50 hover:scale-105 transition-all duration-200 border-2 border-white/20"
            >
              <MessageSquare className="h-6 w-6 text-white" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={[
                // Mobile: floating card
                "fixed z-50 flex flex-col",
                "inset-x-4 bottom-4 rounded-2xl",
                "h-[75dvh]",
                // sm+: floating card bottom-right
                "sm:inset-auto sm:bottom-6 sm:right-6",
                "sm:h-[580px] sm:w-[380px]",
                "sm:rounded-2xl",
                // md+: a bit wider
                "md:w-[420px]",
                // Styling
                "bg-background/95 backdrop-blur-xl",
                "shadow-2xl shadow-black/20",
                "border border-border/50",
                "overflow-hidden",
              ].join(" ")}
            >
              {/* ── Header ── */}
              <div className="bg-gradient-to-r from-primary to-accent px-4 py-3.5 sm:px-5 sm:py-4 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Avatar */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/30 shrink-0">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white leading-none">
                        Foodie AI
                      </p>
                      <p className="text-xs text-white/70 mt-0.5 flex items-center gap-1">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse" />
                        Online · Culinary Expert
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Clear */}
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Clear chat"
                      className="h-8 w-8 rounded-full text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                      onClick={clearChat}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {/* Close */}
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Close chat"
                      className="h-8 w-8 rounded-full text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* ── Messages ── */}
              <ScrollArea className="flex-1 min-h-0">
                <div
                  ref={scrollAreaRef}
                  className="flex flex-col gap-4 px-4 py-5 sm:px-5"
                >
                  <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        className={`flex items-end gap-2 ${
                          msg.role === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {/* Avatar dot */}
                        <div
                          className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-full shadow-sm ${
                            msg.role === "user"
                              ? "bg-gradient-to-br from-primary to-accent"
                              : "bg-muted border border-border"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <User className="h-3.5 w-3.5 text-white" />
                          ) : (
                            <Bot className="h-3.5 w-3.5 text-primary" />
                          )}
                        </div>

                        <div
                          className={`flex flex-col gap-1 max-w-[78%] ${
                            msg.role === "user" ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed shadow-sm break-words ${
                              msg.role === "user"
                                ? "bg-gradient-to-br from-primary to-accent text-white rounded-br-[4px] shadow-primary/20"
                                : "bg-muted border border-border/50 text-foreground rounded-bl-[4px]"
                            }`}
                          >
                            {msg.role === "assistant" ? (
                              <SimpleMarkdown content={msg.content} />
                            ) : (
                              msg.content
                            )}
                          </div>
                          {/* Timestamp */}
                          <span className="text-[10px] text-muted-foreground px-1">
                            {msg.time}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-end gap-2"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted border border-border shadow-sm">
                        <Bot className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="rounded-2xl rounded-bl-[4px] bg-muted border border-border/50 px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
                          <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
                          <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} className="h-1" />
                </div>
              </ScrollArea>

              {/* ── Quick prompts ── */}
              <div className="shrink-0 border-t border-border/40 bg-background/60 px-4 py-2.5 sm:px-5">
                <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      disabled={isLoading}
                      className="shrink-0 rounded-full border border-border/60 bg-background px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Input ── */}
              <div className="shrink-0 border-t border-border/40 bg-background/80 backdrop-blur-xl px-3 py-3 sm:px-4">
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    placeholder="Ask me anything about food…"
                    className="flex-1 min-w-0 rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 disabled:opacity-50 transition-all"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isLoading}
                    aria-label="Send message"
                    className="shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-md hover:opacity-90 disabled:opacity-40 transition-all"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
                <p className="mt-2 text-center text-[10px] text-muted-foreground/50">
                  Powered by Google Gemini · Foodie AI
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
