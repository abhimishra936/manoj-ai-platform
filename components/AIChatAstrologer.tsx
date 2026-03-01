"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function AIChatAstrologer() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "🌌 Welcome. I am your AI Astrologer. Ask your question.",
    },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);

  /* AUTO SCROLL */
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  /* ===== SPEAK RESPONSE ===== */
  const speak = (text: string) => {
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 1;
    speechSynthesis.speak(utter);
  };

  /* ===== LIVE VOICE INPUT (WHATSAPP STYLE) ===== */
  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return alert("Voice not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onstart = () => setRecording(true);

    recognition.onresult = (event: any) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      // LIVE typing effect
      setInput(transcript);
    };

    recognition.onend = () => {
      setRecording(false);
      sendMessage(input);
    };

    recognition.start();
  };

  /* ===== SEND ===== */
  const sendMessage = async (voiceText?: string) => {
    const text = (voiceText || input).trim();
    if (!text || loading) return;

    const userMessage: Message = { role: "user", text };

    setInput("");
    setLoading(true);

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

      if (!res.body) throw new Error();

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        fullText += decoder.decode(value);

        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "ai",
            text: fullText,
          };
          return copy;
        });
      }

      // AUTO AUDIO REPLY
      speak(fullText);
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "ai",
          text: "⚠️ Cosmic connection interrupted.",
        };
        return copy;
      });
    }

    setLoading(false);
  };

  return (
    <section className="py-8 px-2">
      <div className="max-w-3xl mx-auto">

        <h2 className="text-center text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          AI ASTROLOGER
        </h2>

        <div className="rounded-3xl border border-white/10 bg-[#0b1022] overflow-hidden shadow-2xl">

          <div
            ref={containerRef}
            className="h-[65vh] overflow-y-auto p-4 space-y-3"
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
                  className={`max-w-[80%] px-4 py-2 rounded-xl ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="p-3 bg-black/40 border-t border-white/10 flex gap-2">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl bg-white/10 text-white p-2"
              placeholder="Ask astrology question..."
            />

            {/* WHATSAPP MIC */}
            <button
              onClick={startVoice}
              className={`w-11 h-11 rounded-full text-white
              ${
                recording
                  ? "bg-red-500 animate-pulse"
                  : "bg-pink-600"
              }`}
            >
              🎤
            </button>

            <button
              onClick={() => sendMessage()}
              className="px-4 rounded-xl bg-indigo-500 text-white"
            >
              Send
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}