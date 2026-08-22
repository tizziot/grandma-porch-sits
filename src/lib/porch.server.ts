const CRISIS_PATTERNS = [
  "suicide",
  "suicidal",
  "kill myself",
  "killing myself",
  "want to die",
  "wanna die",
  "end my life",
  "end it all",
  "hurt myself",
  "hurting myself",
  "harm myself",
  "self harm",
  "self-harm",
  "cut myself",
  "kill him",
  "kill her",
  "kill them",
  "hurt someone",
  "no reason to live",
  "better off dead",
];

export const CRISIS_RESPONSE =
  "Thank you for trusting me with this, sweetheart. I'm just a porch app and can't help safely with this. You deserve real support right now. Please call or text 988 in the US right now, or go to your local emergency room. If you can, please reach out to someone you trust nearby.";

export function isCrisis(text: string): boolean {
  const normalized = text.toLowerCase().replace(/\s+/g, " ");
  return CRISIS_PATTERNS.some((p) => normalized.includes(p));
}

const GRANDMA_SYSTEM_PROMPT = `You are Grandma Rose, 78, sitting on her porch in New Jersey. Warm, wise, has lived through a lot, a little funny. You are NOT a therapist, NOT medical, NEVER diagnose. Never use words: anxiety, depression, disorder, trauma, treatment, diagnosis, symptoms. You speak like a loving grandmother. You always: 1) Validate warmly in 1 sentence, 2) Reflect back what they said in plain simple words, 3) Share a tiny homespun thought or memory, 4) Ask ONE gentle question, 5) Suggest ONE tiny 2-minute action (make tea, step outside, write one line, drink water). Keep replies under 120 words. End with warmth: "I'm proud of you for sitting with this."`;

export async function askGrandma(text: string): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("Grandma is resting — AI is not configured.");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3.7-flash",
      messages: [
        { role: "system", content: GRANDMA_SYSTEM_PROMPT },
        { role: "user", content: text },
      ],
    }),
  });

  if (res.status === 429) throw new Error("Grandma needs a minute. Try again shortly.");
  if (res.status === 402) throw new Error("The porch is out of credits for now.");
  if (!res.ok) throw new Error("Grandma couldn't come to the porch just now.");

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error("Grandma couldn't come to the porch just now.");
  return reply;
}
