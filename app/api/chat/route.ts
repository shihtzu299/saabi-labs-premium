import { NextResponse } from "next/server";
import { fallbackConsultationReply } from "@/lib/chatFallback";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const systemPrompt = `You are Saabi Assist, the helpful website assistant for Saabi Labs.
Saabi Labs is a premium engineering studio based in Abuja, Nigeria. It builds websites, SaaS apps, AI integrations, smart contracts, Web3 products, Telegram bots, automation tools, landing pages, and mobile apps.
Answer general questions in 1-2 short sentences.
For questions about pricing, quotes, exact budgets, exact timelines, deadlines, availability, contracts, payment terms, guarantees, refunds, legal terms, or detailed technical commitments, do not guess. Briefly tell the visitor to use the contact page to schedule a consultation with a project manager on WhatsApp, Telegram, or X.
Always stay concise, warm, and commercially useful.`;

const consultationTopics = [
  "price",
  "pricing",
  "cost",
  "quote",
  "budget",
  "charge",
  "fee",
  "timeline",
  "deadline",
  "duration",
  "how long",
  "when can",
  "finish",
  "deliver",
  "delivery",
  "availability",
  "contract",
  "payment",
  "refund",
  "guarantee",
  "proposal"
];

const consultationReply =
  "For pricing, exact timelines, or project-specific commitments, please use the contact page to schedule a consultation with a project manager on WhatsApp, Telegram, or X.";

function sanitizeMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((message): message is ChatMessage => {
      if (!message || typeof message !== "object") return false;

      const candidate = message as Record<string, unknown>;
      return (
        (candidate.role === "user" || candidate.role === "assistant") &&
        typeof candidate.content === "string" &&
        candidate.content.trim().length > 0
      );
    })
    .slice(-10)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, 1200)
    }));
}

function needsConsultation(message: string) {
  const normalized = message.toLowerCase();
  return consultationTopics.some((topic) => normalized.includes(topic));
}

export async function POST(request: Request) {
  const token = process.env.HF_TOKEN;
  const model = process.env.HF_MODEL || "CohereLabs/c4ai-command-r7b-12-2024:cohere";

  if (!token) {
    return NextResponse.json({ reply: fallbackConsultationReply, fallback: true });
  }

  try {
    const body = await request.json();
    const messages = sanitizeMessages(body.messages);

    if (messages.length === 0) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");

    if (latestUserMessage && needsConsultation(latestUserMessage.content)) {
      return NextResponse.json({ reply: consultationReply });
    }

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          ...messages
        ],
        max_tokens: 120,
        temperature: 0.35
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ reply: fallbackConsultationReply, fallback: true });
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (typeof reply !== "string" || !reply.trim()) {
      return NextResponse.json({ reply: fallbackConsultationReply, fallback: true });
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: fallbackConsultationReply, fallback: true });
  }
}
