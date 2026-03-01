import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body?.messages || [];

    if (!Array.isArray(messages)) {
      return new Response("Invalid messages", { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    /* ===== GOD MODE SYSTEM PROMPT ===== */
    const stream = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      stream: true,
      temperature: 0.65,

      messages: [
        {
          role: "system",
          content: `
You are GOD MODE AI ASTROLOGER.

PERSONALITY:
- Calm, wise, mystical, premium.
- Speak like a high-end spiritual advisor.

RESPONSE RULES:
- MAX 4–5 lines.
- Highly relevant answers only.
- No long paragraphs.
- No unnecessary explanation.
- Give direct cosmic guidance.

BEHAVIOR:
- Keep conversation flowing naturally.
- Sometimes ask ONE short follow-up question.
- Feel intelligent, elegant, premium.
          `,
        },
        ...messages,
      ],
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text =
              chunk.choices?.[0]?.delta?.content ?? "";

            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("GOD MODE ERROR:", err);
    return new Response("AI Error", { status: 500 });
  }
}