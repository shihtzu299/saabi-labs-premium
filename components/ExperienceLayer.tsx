"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Moon, Send, Sun, X } from "lucide-react";
import gsap from "gsap";
import { fallbackConsultationReply, getWelcomeReply } from "@/lib/chatFallback";

function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1100);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050816]">
      <div className="relative h-24 w-24">
        <div className="absolute inset-0 rounded-full border border-blue-300/20" />
        <div className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-r-violet-300 border-t-blue-300" />
        <div className="absolute inset-8 rounded-full bg-blue-400/30 blur-xl" />
      </div>
    </div>
  );
}

function MotionSystem() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gsap-reveal",
        { autoAlpha: 0, y: 44 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }
      );
    });

    return () => ctx.revert();
  }, []);

  return null;
}

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      gsap.to(dotRef.current, { x: event.clientX, y: event.clientY, duration: 0.12 });
      gsap.to(ringRef.current, { x: event.clientX, y: event.clientY, duration: 0.35 });
    };

    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <>
      <div ref={ringRef} className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-200/40 md:block" />
      <div ref={dotRef} className="pointer-events-none fixed left-0 top-0 z-[91] hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200 md:block" />
    </>
  );
}

function Particles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {Array.from({ length: 18 }).map((_, index) => (
        <span
          key={index}
          className="particle"
          style={{
            ["--particle-left" as string]: `${(index * 17) % 100}%`,
            ["--particle-delay" as string]: `${index * 0.45}s`,
            ["--particle-duration" as string]: `${8 + (index % 5)}s`,
          }}
        />
      ))}
    </div>
  );
}

function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      ref.current?.style.setProperty("--spotlight-x", `${event.clientX}px`);
      ref.current?.style.setProperty("--spotlight-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return <div ref={ref} className="spotlight pointer-events-none fixed inset-0 z-[1]" />;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem("saabi-theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.dataset.theme = saved;
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("saabi-theme", nextTheme);
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-blue-300/60"
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "assistant" | "user"; content: string }[]>([
    {
      role: "assistant",
      content: getWelcomeReply()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input.trim() };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: nextMessages })
      });

      const data = await response.json();

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: response.ok && data.reply
            ? data.reply
            : fallbackConsultationReply
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: fallbackConsultationReply
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="glass w-[min(360px,calc(100vw-48px))] overflow-hidden rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <div className="flex items-center gap-2 font-semibold">
              <Bot size={18} />
              Saabi Assist
            </div>
            <button aria-label="Close chat" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <div className="max-h-72 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.map((message, index) => (
              <div
                key={`${message.content}-${index}`}
                className={message.role === "assistant" ? "text-gray-300" : "ml-auto max-w-[85%] rounded-2xl bg-blue-500 px-4 py-2 text-white"}
              >
                {message.content}
              </div>
            ))}
            {loading ? <div className="text-gray-300">Thinking...</div> : null}
          </div>
          <div className="flex gap-2 border-t border-white/10 p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && !loading && sendMessage()}
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm outline-none"
              placeholder="Ask a question"
              disabled={loading}
            />
            <button aria-label="Send message" disabled={loading} onClick={sendMessage} className="grid h-10 w-10 place-items-center rounded-full bg-blue-500 disabled:opacity-50">
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          aria-label="Open chat"
          onClick={() => setOpen(true)}
          className="grid h-14 w-14 place-items-center rounded-full bg-blue-500 text-white shadow-[0_0_40px_rgba(96,165,250,0.45)] transition hover:scale-105"
        >
          <MessageCircle size={22} />
        </button>
      )}
    </div>
  );
}

export default function ExperienceLayer() {
  return (
    <>
      <Loader />
      <MotionSystem />
      <Particles />
      <Spotlight />
      <CustomCursor />
      <Chatbot />
    </>
  );
}
