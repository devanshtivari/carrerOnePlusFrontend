"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Send, Bot, User, ChevronRight, MessageSquare, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

/* ── Animation variants ── */
const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your Career1Plus AI Assistant. I can help you debug your code, explain concepts, or give you hints. What are you working on today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setIsLoading(false);
  }, []);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message
    const newMessages: Message[] = [
      ...messages,
      { id: Date.now().toString(), role: "user", content: userMessage }
    ];
    setMessages(newMessages);
    setIsLoading(true);

    // Create a placeholder assistant message for streaming
    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" }
    ]);

    try {
      const token = sessionStorage.getItem('access_token');
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      const response = await fetch(`${apiUrl}/ai/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          message: userMessage,
          history: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Failed to get response");

      // Check if the response is a stream or JSON fallback
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("text/plain") && response.body) {
        // ── Streaming response ──
        setIsStreaming(true);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          
          // Append chunk to the assistant message
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantId
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        }
      } else {
        // ── JSON fallback (non-streaming) ──
        const data = await response.json();
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantId
              ? { ...msg, content: data.reply }
              : msg
          )
        );
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        // User stopped the stream — keep partial content
        return;
      }
      console.error(error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantId
            ? { ...msg, content: "Sorry, I'm having trouble connecting right now. Please try again." }
            : msg
        )
      );
    } finally {
      abortControllerRef.current = null;
      setIsStreaming(false);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6 h-full"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Breadcrumbs */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 text-[13px] text-[#A1A1AA] font-medium"
      >
        <Link href="/student" className="hover:text-white transition-colors cursor-pointer">
          Home
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-[#F2F2F2]">AI Code Tutor</span>
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <MessageSquare size={24} className="text-[#A1A1AA]" />
          <h1 className="text-[#F2F2F2] text-2xl lg:text-3xl font-bold leading-tight">
            AI Code Tutor
          </h1>
        </div>
        <p className="text-[#A1A1AA] text-sm">
          Your personal AI coding tutor. Ask anything about HTML, CSS, JavaScript, or AI concepts.
        </p>
      </motion.div>

      {/* Gradient Separator */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30" />

      {/* Chat Card */}
      <motion.div 
        variants={fadeUp}
        className="flex-1 min-h-0 flex flex-col bg-surface-200 border border-border-default rounded-xl overflow-hidden relative"
      >
        {/* Chat header bar */}
        <div className="px-5 py-4 border-b border-border-default bg-surface-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Bot size={18} className="text-emerald-500" />
            </div>
            <div>
              <h2 className="text-[#F2F2F2] font-semibold text-sm tracking-tight flex items-center gap-2">
                Gemini Instructor
                <span className={`size-1.5 rounded-full ${isStreaming ? 'bg-amber-400' : 'bg-emerald-500'} animate-pulse`} />
              </h2>
              {isStreaming && (
                <span className="text-[10px] text-amber-400/80 font-medium">Streaming...</span>
              )}
            </div>
          </div>

          {/* Stop button */}
          {isStreaming && (
            <button
              onClick={stopStreaming}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-200 hover:bg-surface-100 border border-border-default rounded-lg text-[11px] font-bold text-[#F2F2F2] transition-colors cursor-pointer"
            >
              <Square size={10} className="fill-current" />
              Stop
            </button>
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar pb-32">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div 
                key={message.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`size-8 shrink-0 rounded-lg flex items-center justify-center border ${
                  message.role === 'user' 
                    ? 'bg-surface-300 border-white/10' 
                    : 'bg-emerald-950/30 border-emerald-500/20 text-accent-primary'
                }`}>
                  {message.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} />}
                </div>
                <div className={`px-5 py-3.5 rounded-2xl max-w-[80%] text-[13px] leading-relaxed ${
                  message.role === 'user'
                    ? 'bg-white text-black font-semibold'
                    : 'bg-surface-300 text-[#F2F2F2] border border-border-default'
                }`}>
                  {/* Show cursor while streaming the current message */}
                  {message.role === "assistant" && message.content === "" && isLoading ? (
                    <div className="flex items-center gap-3 py-1">
                      <div className="flex gap-1">
                        <span className="size-1 bg-accent-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="size-1 bg-accent-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="size-1 bg-accent-primary rounded-full animate-bounce" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2F2F2]/40">Thinking...</span>
                    </div>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-surface-200 prose-pre:border-border-default">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                      {/* Blinking cursor during streaming */}
                      {isStreaming && message.id === messages[messages.length - 1]?.id && message.role === "assistant" && (
                        <span className="inline-block w-0.5 h-4 bg-accent-primary animate-pulse ml-0.5 align-text-bottom" />
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={bottomRef} className="h-4" />
        </div>

        {/* Input area */}
        <div className="p-5 border-t border-border-default bg-surface-300/50 backdrop-blur-xl absolute bottom-0 left-0 right-0 z-10">
          <form onSubmit={sendMessage} className="relative flex items-center max-w-5xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your code..."
              className="w-full bg-surface-200 border border-border-default rounded-xl pl-6 pr-16 py-3.5 text-sm text-[#F2F2F2] placeholder:text-[#888888] focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 px-4 py-2 flex items-center justify-center rounded-lg bg-white text-black hover:bg-[#E5E5E5] disabled:opacity-20 transition-all font-bold text-xs cursor-pointer"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
