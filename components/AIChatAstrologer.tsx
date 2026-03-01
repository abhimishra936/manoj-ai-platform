"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

const THINKING_STEPS = [
  "🔮 Reading cosmic energies...",
  "🪐 Aligning your planets...",
  "✨ Interpreting destiny patterns...",
];

export default function AIChatAstrologer() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [thinkingIndex, setThinkingIndex] = useState(0);

  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef("");
  const containerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "🌌 Welcome. I am your AI Astrologer. Ask me anything about your life journey.",
    },
  ]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  /* ================= THINKING TEXT ================= */
  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => {
      setThinkingIndex((p) => (p + 1) % THINKING_STEPS.length);
    }, 1800);
    return () => clearInterval(id);
  }, [loading]);

  /* ================= INDIAN CLEAR VOICE ================= */
  const speak = (text: string) => {
    speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text.slice(0, 350));
    utter.rate = 0.95;
    utter.pitch = 1;
    utter.lang = "en-IN"; // 👈 Indian voice

    const voices = speechSynthesis.getVoices();

    // prefer indian / english female voice
    const indianVoice =
      voices.find(v => v.lang.includes("en-IN")) ||
      voices.find(v => v.name.toLowerCase().includes("india"));

    if (indianVoice) utter.voice = indianVoice;

    speechSynthesis.speak(utter);
  };

  /* ================= VOICE ================= */
  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return alert("Voice not supported");

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.continuous = true;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setRecording(true);
      finalTranscriptRef.current = "";
    };

    recognition.onresult = (e: any) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      finalTranscriptRef.current = text;
      setInput(text);
    };

    recognition.start();
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setRecording(false);

    const text = finalTranscriptRef.current.trim();
    if (text) sendMessage(text);
  };

  /* ================= SEND ================= */
  const sendMessage = async (voiceText?: string) => {
    const text = (voiceText || input).trim();
    if (!text || loading) return;

    const userMessage: Message = { role: "user", text };

    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, userMessage, { role: "ai", text: "" }]);

    try {
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const res = await fetch("/api/astro-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.body) throw new Error();

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let full = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        full += decoder.decode(value);

        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "ai", text: full };
          return copy;
        });
      }

      speak(full);
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

  /* ================= UI ================= */
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#050914] to-[#0c1230] text-white flex justify-center px-2 sm:px-4 py-4">

      <div className="w-full max-w-3xl flex flex-col h-[95vh] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="p-3 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
          <div>
            <p className="font-semibold">AI Astrologer</p>
            <p className="text-xs text-green-300">● Online • Spiritual Guidance</p>
          </div>
        </div>

        {/* CHAT AREA */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3"
        >
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
              <div
                className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm sm:text-base whitespace-pre-line ${
                  m.role==="user"
                    ? "bg-gradient-to-r from-indigo-600 to-pink-600"
                    : "bg-white/10"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-purple-300 text-sm animate-pulse">
              {THINKING_STEPS[thinkingIndex]}
            </div>
          )}
        </div>

        {/* INPUT AREA — CHATGPT STYLE */}
        <div className="p-3 border-t border-white/10 bg-black/30">
          <div className="relative">

            <input
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              placeholder="Ask your astrology question..."
              className="w-full rounded-full bg-white/10 py-3 pl-4 pr-24 text-sm sm:text-base outline-none"
            />

            {/* MIC INSIDE INPUT */}
            <button
              onMouseDown={startVoice}
              onMouseUp={stopVoice}
              className={`absolute right-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full ${
                recording ? "bg-red-500 animate-pulse" : "bg-pink-600"
              }`}
            >
              🎤
            </button>

            {/* SEND */}
            <button
              onClick={()=>sendMessage()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-indigo-500"
            >
              ➤
            </button>

          </div>
        </div>

      </div>
    </section>
  );
}