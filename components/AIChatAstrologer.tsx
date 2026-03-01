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
      text: "🌌 Welcome. I am your AI Astrologer. Ask me anything.",
    },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  /* ===== AUTO SCROLL ===== */
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  /* ===== SPEAK AI RESPONSE ===== */
  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  /* ===== VOICE RECORDING ===== */
  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setRecording(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setRecording(false);
    };

    recognition.onerror = () => setRecording(false);
    recognition.onend = () => setRecording(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  /* ===== SEND MESSAGE ===== */
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const text = input.trim();
    const userMessage: Message = { role: "user", text };

    setInput("");
    setLoading(true);

    // add user + placeholder
    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: "ai", text: "✨ Reading cosmic energy..." },
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

        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "ai",
            text: fullText,
          };
          return copy;
        });
      }

      // 🔊 AUTO SPEAK AI RESPONSE
      speak(fullText);

    } catch (err) {
      console.error(err);

      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "ai",
          text: "⚠️ Cosmic energy interrupted.",
        };
        return copy;
      });
    }

    setLoading(false);
  };

  return (
    <section className="relative py-16 px-4">
      <div className="max-w-3xl mx-auto">

        <h2 className="text-center text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          GOD MODE AI ASTROLOGER
        </h2>

        <div className="rounded-3xl border border-white/10 backdrop-blur-2xl bg-gradient-to-b from-[#0b1022]/95 via-[#121830]/95 to-[#0a0f20]/95 shadow-[0_25px_80px_rgba(0,0,0,0.55)] overflow-hidden">

          {/* CHAT */}
          <div
            ref={containerRef}
            className="h-[500px] overflow-y-auto no-scrollbar p-5 space-y-4"
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
                  className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white"
                      : "bg-white/10 text-white border border-white/15"
                  }`}
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
          <div className="border-t border-white/10 p-4 bg-black/40 flex gap-3">

            <button
              onClick={startVoice}
              className={`px-3 rounded-xl ${
                recording
                  ? "bg-red-500 animate-pulse"
                  : "bg-white/10"
              } text-white`}
            >
              🎤
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your cosmic question..."
              disabled={loading}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 rounded-xl bg-white/10 border border-white/15 px-4 py-2 text-white outline-none"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:scale-105 transition"
            >
              Send
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}