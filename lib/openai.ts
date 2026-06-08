import OpenAI from "openai";
import { requireEnv, env } from "@/lib/env";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: requireEnv("OPENAI_API_KEY") });
  }
  return client;
}

export async function summarize(text: string): Promise<string> {
  const completion = await getClient().chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a precise summarizer. Produce a concise, faithful summary with a one-line TL;DR followed by 3-5 key bullet points. Do not invent details.",
      },
      { role: "user", content: text },
    ],
  });
  return completion.choices[0]?.message?.content?.trim() ?? "";
}
