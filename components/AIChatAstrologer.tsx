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

  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef("");

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

  /* ===== SPEAK RESPONSE (SMART LIMIT) ===== */
  const speak = (text: string) => {
    speechSynthesis.cancel();
    const shortText = text.slice(0, 400); // avoid long speech
    const utter = new SpeechSynthesisUtterance(shortText);
    utter.lang = "en-US";
    utter.rate = 1;
    speechSynthesis.speak(utter);
  };

  /* ===== START VOICE (HOLD TO TALK) ===== */
  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setRecording(true);
      finalTranscriptRef.current = "";
    };

    recognition.onresult = (event: any) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      finalTranscriptRef.current = transcript;
      setInput(transcript); // LIVE typing
    };

    recognition.start();
  };

  /* ===== STOP VOICE ===== */
  const stopVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecording(false);

      const text = finalTranscriptRef.current.trim();
      if (text) sendMessage(text);
    }
  };

  /* ===== SEND MESSAGE ===== */
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

      /* CONSULTATION LOGIC */
      if (fullText.length > 500) {
        fullText +=
          "\n\n🔱 For deeper personalized guidance, you may Book Consultation with Pandit Manoj Kumar Mishra.";
      }

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

        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#060b1f] to-[#0d1333] backdrop-blur-xl overflow-hidden shadow-2xl">

          {/* CHAT AREA */}
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
                  className={`max-w-[80%] px-4 py-2 rounded-xl whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* ASTRO LOADING */}
            {loading && (
              <div className="text-purple-300 text-sm animate-pulse">
                🪐 Aligning planetary energies... Reading your stars...
              </div>
            )}
          </div>

          {/* INPUT BAR */}
          <div className="p-3 bg-black/40 border-t border-white/10 flex gap-2">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl bg-white/10 text-white p-2 outline-none"
              placeholder="Ask astrology question..."
            />

            {/* HOLD TO TALK MIC */}
            <button
              onMouseDown={startVoice}
              onMouseUp={stopVoice}
              onTouchStart={startVoice}
              onTouchEnd={stopVoice}
              className={`w-11 h-11 rounded-full text-white transition ${
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