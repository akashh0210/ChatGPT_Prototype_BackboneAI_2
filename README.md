# Backbone

> A calibration layer woven into the ChatGPT interface — reasoning trace, inline confidence markers, surfaced assumptions, and a self-critique from a separate evaluator model, all visible inside every response.

**[Live Demo →](https://your-deployment-url.vercel.app)** *(update after Vercel deploy)*

---

## What this is

People use ChatGPT for consequential work — research, code, career decisions — and trust outputs that *look* polished without being able to tell when that polish is earned. Survey data from 33 respondents showed 84% caught a serious AI error only *after* they'd already used or shared it, and 82% are miscalibrated in some direction.

Backbone adds four signals to every response, all inside the same surface the user is already reading:

| Signal | What it does |
|---|---|
| **Reasoning trace** | Shows the steps the model took to arrive at the answer — collapsible |
| **Confidence markers** | Inline pills anchored to specific claims: `HIGH`, `MEDIUM`, or `UNVERIFIED` — each with a tooltip explaining why |
| **Assumption surface** | Lists the implicit context the model assumed |
| **Self-critique footer** | A separate evaluation model flags what to verify before acting |

The key architectural choice: the evaluator is a **different model instance** from the generator. Its critique is independent, not the generator hedging its own output.

---

## Screenshots

| Empty state | Full Backbone response | Expanded self-critique |
|---|---|---|
| *(add screenshot)* | *(add screenshot)* | *(add screenshot)* |

---

## Tech stack

- **React 18 + Vite + TypeScript** — SPA, strict mode
- **Tailwind CSS 3** — Custom theme tokens matching ChatGPT 2025's exact color palette
- **Lucide React** — Icons
- **Groq API** — `llama-3.3-70b-versatile` (generation), `llama-3.1-8b-instant` (evaluation)
- **Vercel Edge Functions** — Serverless backend; API key never reaches the client
- **CSS keyframe animations only** — No animation library

---

## Quick start

```bash
git clone https://github.com/akashh0210/ChatGPT_Prototype_BackboneAI_2.git
cd ChatGPT_Prototype_BackboneAI_2
npm install
cp .env.example .env.local
# Add your Groq API key to .env.local (see Environment variables below)
npm run dev
# → http://localhost:5173
```

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | Yes | Your Groq API key from [console.groq.com](https://console.groq.com) |

**Getting a key:**
1. Sign up at [console.groq.com](https://console.groq.com)
2. Navigate to **API Keys** → **Create API Key**
3. Copy the key and paste it into `.env.local` as `GROQ_API_KEY=gsk_...`

The key is only ever read server-side (`/api/backbone` — Vercel Edge Function). It is never bundled into the client.

---

## Project structure

```
backbone-prototype/
├── api/
│   └── backbone.ts          # Vercel Edge Function — two-pass Groq pipeline
├── src/
│   ├── components/
│   │   ├── BackboneResponse.tsx   # Parent: orchestrates all four features
│   │   ├── ReasoningTrace.tsx     # Collapsible reasoning steps
│   │   ├── MainAnswer.tsx         # Prose + inline confidence pills
│   │   ├── ConfidenceMarker.tsx   # Individual pill with tooltip
│   │   ├── AssumptionsBlock.tsx   # Assumption tags
│   │   ├── SelfCritiqueFooter.tsx # Expandable critique footer
│   │   ├── IssueCard.tsx          # Individual issue card
│   │   ├── ChatArea.tsx           # Layout + state orchestration
│   │   ├── PresetPrompts.tsx      # Four preset buttons
│   │   ├── InputBar.tsx           # Free-form input
│   │   └── ...                    # Sidebar, Header, UserMessage, etc.
│   ├── hooks/
│   │   ├── useBackboneStream.ts   # SSE streaming + stage machine
│   │   └── useReducedMotion.ts    # prefers-reduced-motion detection
│   ├── lib/
│   │   └── matchClaim.ts          # Substring matching for confidence pills
│   ├── data/
│   │   ├── presets.ts             # Four preset prompts
│   │   └── fallbackResponses.ts   # Offline fallback per preset
│   └── types/
│       └── backbone.ts            # Full TypeScript types
├── .env.example
└── vite.config.ts               # Dev-mode API middleware
```

---

## How it works

Every request runs a **two-pass pipeline** on the backend:

```
User prompt
    │
    ▼
┌─────────────────────────────────────┐
│  Generation pass (llama-3.3-70b)    │
│  → reasoning_steps                  │
│  → main_answer (streamed)           │
│  → assumptions                      │
└──────────────┬──────────────────────┘
               │  full response as context
               ▼
┌─────────────────────────────────────┐
│  Evaluation pass (llama-3.1-8b)     │
│  → confidence_markers (per claim)   │
│  → issues (3 structured critiques)  │
└─────────────────────────────────────┘
               │
               ▼  streamed as SSE to frontend
```

The frontend renders progressively in six stages as events arrive: loading dots → reasoning trace → streamed answer → confidence pills → assumptions → self-critique.

The evaluator model receives the generator's full output as context. It does not know what the user asked — only what the generator produced — keeping the evaluation independent.

See [`docs/PRD.md`](docs/PRD.md) for the full specification and [`docs/PROBLEM_STATEMENT.md`](docs/PROBLEM_STATEMENT.md) for the research and problem context.

---

## What this prototype is NOT

- **Not a trust score.** Confidence is three discrete labels anchored to specific claims with reasoning — not an aggregate percentage anywhere.
- **Not a separate panel.** All four features live inside the response, in the same surface the user is reading.
- **Not a fact-checker.** Backbone surfaces what to verify and what the evaluator found weak — then lets the user decide.
- **Not a refusal mechanism.** Backbone never blocks responses; it always delivers, with calibration cues attached.
- **Not a black box.** The evaluator is a different model from the generator. Its reasoning is visible in every pill and every issue card.

---

## Acknowledgments

Built as part of the AI Product Management Fellowship case study (cohort 2025–2026). Research grounded in a 33-response survey and 6 in-depth interviews with daily AI users conducting high-stakes knowledge work.

---

## License

MIT
