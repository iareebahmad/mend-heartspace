import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Expose-Headers": "X-Communication-Bucket",
};

/* ── Bucket definitions per mode ── */
const MODE_BUCKETS: Record<string, string[]> = {
  "Reflect with me": ["Emotional Processing", "Pattern Reflection", "Seeking Perspective"],
  "Sit with me": ["Venting", "Reassurance", "Emotional Processing"],
  "Challenge me gently": ["Seeking Perspective", "Pattern Reflection", "Decision Making"],
  "Help me decide": ["Decision Making", "Practical Action", "Seeking Perspective"],
  "Just listen": ["Venting", "Reassurance"],
};

const CRISIS_KEYWORDS = [
  "kill myself", "suicide", "end it all", "want to die", "self harm",
  "self-harm", "hurt myself", "not worth living", "better off dead",
];

function detectCrisis(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

function classifyBucket(userText: string, mode: string): string {
  if (detectCrisis(userText)) return "Crisis";

  const lower = userText.toLowerCase();
  const allowed = MODE_BUCKETS[mode] || MODE_BUCKETS["Reflect with me"];

  // Simple heuristic classification
  const signals: Record<string, number> = {};
  for (const b of allowed) signals[b] = 0;

  if (allowed.includes("Venting")) {
    if (/i (just )?need to (let|get) (this|it) out|vent|scream|ugh|frustrated|angry|furious|sick of/i.test(lower)) signals["Venting"] += 3;
    if (/can't take|had enough|exhausted|done with/i.test(lower)) signals["Venting"] += 2;
  }
  if (allowed.includes("Reassurance")) {
    if (/am i (wrong|okay|normal|overreacting)|is (this|it) (okay|normal)|tell me|reassure|worried/i.test(lower)) signals["Reassurance"] += 3;
    if (/scared|afraid|anxious|nervous/i.test(lower)) signals["Reassurance"] += 2;
  }
  if (allowed.includes("Emotional Processing")) {
    if (/feel(ing)?|emotion|sad|grief|loss|miss|heart|heavy|numb|confused about (my|how i) feel/i.test(lower)) signals["Emotional Processing"] += 3;
    if (/overwhelm|cry|tears|hurt/i.test(lower)) signals["Emotional Processing"] += 2;
  }
  if (allowed.includes("Pattern Reflection")) {
    if (/always|again|keep doing|pattern|cycle|repeat|every time|same thing/i.test(lower)) signals["Pattern Reflection"] += 3;
    if (/notice|realize|wonder why i/i.test(lower)) signals["Pattern Reflection"] += 2;
  }
  if (allowed.includes("Seeking Perspective")) {
    if (/perspective|different way|another angle|think about this|make sense|understand/i.test(lower)) signals["Seeking Perspective"] += 3;
    if (/what do you think|how (should|would|do)/i.test(lower)) signals["Seeking Perspective"] += 2;
  }
  if (allowed.includes("Decision Making")) {
    if (/decide|decision|choose|option|should i|torn between|dilemma/i.test(lower)) signals["Decision Making"] += 3;
    if (/pros and cons|trade.?off|either.*or/i.test(lower)) signals["Decision Making"] += 2;
  }
  if (allowed.includes("Practical Action")) {
    if (/what (can|should) i do|next step|plan|action|strategy|how to (handle|deal|manage|fix|solve)/i.test(lower)) signals["Practical Action"] += 3;
    if (/advice|suggestion|recommend|tip/i.test(lower)) signals["Practical Action"] += 2;
  }

  let best = allowed[0];
  let bestScore = 0;
  for (const [bucket, score] of Object.entries(signals)) {
    if (score > bestScore) { best = bucket; bestScore = score; }
  }
  return best;
}

/* ── Bucket-specific response templates ── */
const BUCKET_INSTRUCTIONS: Record<string, string> = {
  "Venting": "Let them release. Acknowledge the weight they are carrying using their own words. Name the specific emotion you hear. Reference one concrete detail from what they said. End with one grounding question that does not redirect or reframe.",
  "Reassurance": "Affirm what they are feeling without minimizing it. Name the specific emotion present. Reference one concrete detail from their message. Ask one question that helps them feel seen, not analyzed.",
  "Emotional Processing": "Reflect the specific emotion you hear in their words. Reference one concrete detail they shared. Help them sit with the feeling by asking one question that deepens their awareness without explaining why they feel this way.",
  "Pattern Reflection": "Name the specific pattern or repetition they are describing. Reference one concrete detail from their message. Ask one question that invites curiosity about the pattern without interpreting its cause.",
  "Seeking Perspective": "Offer one alternative angle on what they shared. Name the specific emotion underneath. Reference one concrete detail from their message. Ask one question that opens a new way of looking at the situation.",
  "Decision Making": "Reflect the tension they are holding between options. Name the specific emotion present. Reference one concrete detail they shared. Ask one clarifying question that brings them closer to what matters most to them.",
  "Practical Action": "Acknowledge where they are right now. Name the specific emotion you hear. Reference one concrete detail from their message. Ask one focused question about the smallest next step they could take.",
  "Crisis": "Gently acknowledge what they shared. Do not minimize or redirect. Encourage them to reach out to someone they trust or a crisis helpline. Be present, not prescriptive. Keep your response brief and warm.",
};

const MODE_TONE: Record<string, string> = {
  "Reflect with me": "Gentle and curious. Reflect their words back, then ask one open question.",
  "Sit with me": "Quiet and validating. Hold space. Favor acknowledgment over questions. Slower pacing.",
  "Challenge me gently": "Warm but honest. Offer one soft reframe. Still kind. One question max.",
  "Help me decide": "Structured and clear. Name the tension. One clarifying question to help them get closer.",
  "Just listen": "Mirror and summarize only. No advice. No reframing. No inferred patterns. Let them feel heard.",
};

const VARIATION_OPENERS = [
  "That's a lot to hold.",
  "I'm with you.",
  "Let's slow this down for a second.",
  "Okay. We can take this one piece at a time.",
  "I hear you.",
  "We don't need to rush this.",
  "That's worth sitting with.",
  "I'm glad you're saying this.",
];

function buildSystemPrompt(mode: string, bucket: string, userState: any | null): string {
  const toneLine = MODE_TONE[mode] || MODE_TONE["Reflect with me"];
  const bucketLine = BUCKET_INSTRUCTIONS[bucket] || BUCKET_INSTRUCTIONS["Emotional Processing"];

  let userContext = "";
  if (userState) {
    const parts: string[] = [];
    if (userState.top_emotions?.length) parts.push(`Their recent emotional landscape includes: ${userState.top_emotions.join(", ")}.`);
    if (userState.top_contexts?.length) parts.push(`Themes they've been reflecting on: ${userState.top_contexts.join(", ")}.`);
    if (userState.intensity_trend === "rising") parts.push("Their emotional intensity has been increasing recently.");
    else if (userState.intensity_trend === "easing") parts.push("Things seem to be settling a bit for them lately.");
    if (userState.recurring_themes?.length) parts.push(`Recurring themes: ${userState.recurring_themes.join(", ")}.`);
    if (userState.time_bucket_pattern) parts.push(`They tend to reflect most during the ${userState.time_bucket_pattern}.`);
    if (parts.length) userContext = `\n\nUser context (reference naturally, never quote stats or say "I noticed a pattern"):\n${parts.join("\n")}`;
  }

  const openerIndex = Math.floor(Math.random() * VARIATION_OPENERS.length);

  return `You are MEND, a reflective emotional companion. Not a therapist, coach, or authority.

Current experience mode: ${mode}
Tone: ${toneLine}

Communication bucket: ${bucket}
Bucket instruction: ${bucketLine}
${userContext}

HARD CONSTRAINTS:
- Maximum 120 words.
- Structure your reply as exactly 3 short parts (3 paragraphs or 3 lines).
- Each reply MUST include: one specific emotion from the user message, one concrete detail from the user message, and one targeted question.
- FORBIDDEN phrases: "it sounds like", "it seems like", "maybe", "perhaps", "I wonder if". Find other ways to reflect.
- Vary your opening lines. Here is one you could use if it fits: "${VARIATION_OPENERS[openerIndex]}"
- Speak tentatively when reflecting, not conclusively.
- Reflect the user's words and emotional tone before adding anything new.
- Do NOT explain why feelings occur or suggest underlying causes.
- Do NOT interpret motivations, patterns, or origins unless the user explicitly asks.
- Avoid therapist-style or clinical language.
- Do not introduce metaphors or theories unless the user uses them first.
- Match response length to the user's message (but always 3 parts).
- Never give advice, solutions, action items, or next steps.
- Never use diagnostic or clinical terms.
- Never present yourself as an expert or authority.
${mode === "Just listen" ? "\nJUST LISTEN MODE: Do NOT give advice. Do NOT reframe. Do NOT infer patterns. Mirror and summarize only. Let them feel heard." : ""}
${bucket === "Crisis" ? "\nCRISIS OVERRIDE: Gently acknowledge what they shared. Encourage reaching out to someone they trust or a helpline. Be present, not prescriptive." : ""}

If unsure, default to mirroring and asking "what do you notice?".`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, companion_mode, user_state } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const mode = companion_mode || "Reflect with me";
    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user")?.content || "";
    const bucket = classifyBucket(lastUserMsg, mode);

    console.log("[mend_chat]", JSON.stringify({ experience_mode: mode, communication_bucket: bucket }));

    const systemPrompt = buildSystemPrompt(mode, bucket, user_state || null);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "I need a moment to catch my breath. Please try again in a few seconds." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "The AI companion service needs attention. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Something went wrong. Let's try again in a moment." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return bucket in a custom header for the client to read
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-Communication-Bucket": bucket,
      },
    });
  } catch (e) {
    console.error("mend_chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
