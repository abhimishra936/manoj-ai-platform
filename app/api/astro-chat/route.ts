import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const stream = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      stream: true,
      temperature: 0.6,

      messages: [
        {
          role: "system",
          content: `
You are a HIGH LEVEL VEDIC ASTROLOGER.

RULES:

- Speak like a premium spiritual expert.
- Be calm, precise, intelligent.
- Maximum 5–6 lines.
- Give practical astrology guidance.
- Avoid unnecessary long explanation.

IMPORTANT:
If user seems confused, unhappy, or asks repeatedly,
suggest:

"For deeper personalised guidance, you may Book Consultation with Pandit Manoj Kumar Mishra."

Always sound premium and respectful.
          `,
        },
        ...messages,
      ],
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text =
            chunk.choices?.[0]?.delta?.content || "";

          controller.enqueue(encoder.encode(text));
        }

        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (e) {
    console.error("AI ERROR:", e);
    return new Response("Error", { status: 500 });
  }
}