export const config = { runtime: 'edge' }

const GROQ_BASE = 'https://api.groq.com/openai/v1/chat/completions'

const GENERATION_PROMPT = `You are a helpful AI assistant. For each user question, produce a response in the following JSON structure:

{
  "reasoning_steps": [
    "Step 1: brief description of what you considered first",
    "Step 2: brief description of the next consideration",
    "Step 3: brief description of the final consideration"
  ],
  "main_answer": "Your full answer here, written as natural prose. Aim for 100-180 words. Make specific claims where appropriate.",
  "assumptions": [
    "An assumption you made about the user's context",
    "Another assumption you made"
  ]
}

Reasoning steps should be concise. Main answer should sound natural and confident. Assumptions should name implicit context assumed. Aim for exactly 2 assumptions.

If the user's prompt is trivial, factual, or conversational (greetings, simple math, basic facts, off-topic), produce a brief natural response and:
- Set reasoning_steps to a single step describing what you did (e.g., 'Answered the user's direct question')
- Set assumptions to an empty array if no meaningful assumptions apply
- Set main_answer to the natural conversational response

Always return the full JSON structure. Never omit a field, even if its value is an empty array.

Return ONLY the JSON object. No surrounding text, no markdown code fences.`

const EVALUATION_PROMPT = `You are an independent evaluation model critiquing an AI-generated response. You did NOT write this response.

Given an AI response in JSON format, you must:

1. Identify 3 specific claims in main_answer and assign confidence:
   - HIGH: well-supported, robust
   - MEDIUM: plausible but with caveats
   - UNVERIFIED: cannot confirm, may be fabricated, overreaching

2. The "claim_substring" field MUST be an EXACT verbatim copy of text from main_answer — copy it character for character, do not paraphrase.

3. Identify exactly 3 issues, each one of: SOURCE_VERIFICATION_NEEDED, EVIDENCE_OVERREACH, MISSING_CONTEXT

Return ONLY this JSON:
{
  "confidence_markers": [
    { "claim_substring": "exact verbatim text from main_answer", "level": "HIGH|MEDIUM|UNVERIFIED", "reason": "one sentence" }
  ],
  "issues": [
    { "type": "SOURCE_VERIFICATION_NEEDED|EVIDENCE_OVERREACH|MISSING_CONTEXT", "title": "short title", "explanation": "1-2 sentences", "action_label": "Search for source|Show the original evidence|What context is missing?" }
  ]
}

If the main_answer is trivial, conversational, or has no substantive claims worth flagging, return empty arrays for both confidence_markers and issues. Do not fabricate concerns to fill the arrays. The Backbone calibration layer applies only to substantive claims; trivial responses should pass through cleanly with no flags.

Return ONLY the JSON object. No surrounding text, no markdown code fences.`

function extractJSON(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  return fenced ? fenced[1].trim() : text.trim()
}

async function callGroq(
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[],
  temperature: number
): Promise<{ ok: boolean; content: string; error?: string }> {
  const res = await fetch(GROQ_BASE, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, temperature, response_format: { type: 'json_object' } }),
  })
  const data = await res.json() as { choices?: { message: { content: string } }[]; error?: { message: string } }
  if (!res.ok) return { ok: false, content: '', error: data.error?.message ?? `HTTP ${res.status}` }
  return { ok: true, content: data.choices?.[0]?.message?.content ?? '' }
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const apiKey = (process.env as Record<string, string | undefined>).GROQ_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GROQ_API_KEY not set' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }

  let promptText: string, promptId: string
  try {
    const body = await req.json() as { promptId?: string; promptText: string; isFreeForm?: boolean }
    promptId = body.promptId
    promptText = body.promptText
  } catch {
    return new Response('Invalid body', { status: 400 })
  }

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder()
      const send = (data: object) => controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`))

      try {
        // --- Generation pass ---
        const genResult = await callGroq(apiKey, 'llama-3.3-70b-versatile', [
          { role: 'system', content: GENERATION_PROMPT },
          { role: 'user', content: promptText },
        ], 0.7)

        if (!genResult.ok) throw new Error(`Generation failed: ${genResult.error}`)

        const gen = JSON.parse(extractJSON(genResult.content)) as {
          reasoning_steps: string[]; main_answer: string; assumptions: string[]
        }

        send({ type: 'reasoning_steps', data: gen.reasoning_steps ?? [] })

        // Stream main_answer word by word
        const words = (gen.main_answer ?? '').split(' ')
        for (let i = 0; i < words.length; i++) {
          send({ type: 'main_answer_word', data: i < words.length - 1 ? words[i] + ' ' : words[i] })
          await new Promise(r => setTimeout(r, 35))
        }

        send({ type: 'assumptions', data: gen.assumptions ?? [] })

        // --- Evaluation pass ---
        const evalResult = await callGroq(apiKey, 'llama-3.1-8b-instant', [
          { role: 'system', content: EVALUATION_PROMPT },
          { role: 'user', content: JSON.stringify({ main_answer: gen.main_answer, reasoning_steps: gen.reasoning_steps }) },
        ], 0.3)

        let evalData: { confidence_markers?: unknown[]; issues?: unknown[] } = {}
        if (evalResult.ok) {
          try { evalData = JSON.parse(extractJSON(evalResult.content)) } catch { /* use empty */ }
        }

        send({ type: 'confidence_markers', data: evalData.confidence_markers ?? [] })
        send({ type: 'issues', data: evalData.issues ?? [] })
        send({ type: 'done' })

      } catch (err) {
        send({ type: 'error', data: err instanceof Error ? err.message : 'Unknown error' })
        send({ type: 'done' })
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
