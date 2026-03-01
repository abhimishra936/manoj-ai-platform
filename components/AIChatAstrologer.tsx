"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function AIChatAstrologer() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "🌌 Welcome. I am your GOD MODE AI Astrologer. Ask me anything.",
    },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ===== AUTO SCROLL ===== */
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  /* ===== TEXTAREA AUTO RESIZE ===== */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }, [input]);

  /* ===== SEND MESSAGE ===== */
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const text = input.trim();
    const userMessage: Message = { role: "user", text };

    setInput("");
    setLoading(true);

    // add user + AI placeholder ONCE (VERY IMPORTANT)
    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: "ai", text: "" },
    ]);

    try {
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const res = await fetch("/api/astro-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.body) throw new Error("No stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        fullText += decoder.decode(value);

        // smooth streaming update
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "ai",
            text: fullText,
          };
          return copy;
        });
      }
    } catch (err) {
      console.error("AI ERROR:", err);

      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "ai",
          text: "⚠️ Cosmic energy interrupted. Try again.",
        };
        return copy;
      });
    }

    setLoading(false);
  };

  return (
    <section className="relative py-6 md:py-14 px-2 sm:px-4">
      <div className="w-full max-w-3xl mx-auto">

        {/* TITLE */}
        <h2 className="
          text-center
          text-2xl sm:text-3xl md:text-4xl
          font-bold
          mb-4 md:mb-6
          bg-clip-text text-transparent
          bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400
        ">
          GOD MODE AI ASTROLOGER
        </h2>

        {/* CHAT CONTAINER */}
        <div className="
          rounded-2xl md:rounded-3xl
          border border-white/10
          backdrop-blur-2xl
          bg-gradient-to-b
          from-[#0b1022]/95
          via-[#121830]/95
          to-[#0a0f20]/95
          shadow-[0_25px_80px_rgba(0,0,0,0.6)]
          overflow-hidden
        ">

          {/* MESSAGES */}
          <div
            ref={containerRef}
            className="
              h-[60vh] md:h-[520px]
              overflow-y-auto
              no-scrollbar
              p-3 sm:p-4 md:p-5
              space-y-3 md:space-y-4
            "
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`
                    max-w-[88%] sm:max-w-[75%]
                    px-3 sm:px-4 py-2.5 sm:py-3
                    rounded-2xl
                    text-sm sm:text-base
                    leading-relaxed
                    break-words
                    ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white"
                        : "bg-white/10 text-white border border-white/15"
                    }
                  `}
                >
                  {msg.text}
                  {loading &&
                    i === messages.length - 1 &&
                    msg.role === "ai" && (
                      <span className="ml-1 animate-pulse">▋</span>
                    )}
                </div>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="
            border-t border-white/10
            bg-black/40
            p-2 sm:p-3
            flex items-end gap-2
          ">
            <textarea
              ref={textareaRef}
              value={input}
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your cosmic question..."
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="
                flex-1 resize-none
                max-h-[140px]
                rounded-xl
                bg-white/10
                border border-white/15
                px-3 sm:px-4 py-2
                text-white
                placeholder:text-white/50
                outline-none
                focus:ring-2 focus:ring-purple-400
              "
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="
                px-4 sm:px-5 py-2
                rounded-xl
                font-medium
                bg-gradient-to-r
                from-indigo-500 via-purple-500 to-pink-500
                text-white
                hover:scale-105
                transition
              "
            >
              Send
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}