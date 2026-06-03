# Build Steps — Backbone Prototype with Claude Code

This is the practical execution guide for building Backbone in Claude Code, broken into phases. Each phase has a goal, a single prompt to send to Claude Code, what to verify before moving on, and rough time estimate.

**Estimated total time:** 8-12 hours of focused work, spread across multiple sessions. The build is broken into 7 phases.

---

## Phase 0 — Setup (15 minutes)

### Goal
Get your environment ready before touching Claude Code.

### Steps

1. **Install prerequisites** if you don't have them:
   - Node.js 20 LTS (nodejs.org)
   - Git
   - A text editor (VS Code is fine — you can use it alongside Claude Code)
   - Claude Code (per the install instructions for your OS)

2. **Get a Grok API key:**
   - Visit `console.x.ai` and sign up
   - Create a new API key in the dashboard
   - Add billing info and **set a usage cap** (e.g., $20/month) to prevent runaway costs
   - Copy the key somewhere safe; you'll need it in Phase 4

3. **Create the project folder:**
   ```bash
   mkdir backbone-prototype
   cd backbone-prototype
   ```

4. **Add the docs:** Drop `PRD.md` and `PROBLEM_STATEMENT.md` into the root of this folder.

5. **Open Claude Code** in this folder. Confirm it's seeing both markdown files.

---

## Phase 1 — Scaffold the project (30 minutes)

### Goal
Working Vite + React + TypeScript + Tailwind project with the exact file structure from the PRD. No component logic yet — just the foundation.

### Prompt to send

```
I'm building a prototype called Backbone. Both PRD.md and PROBLEM_STATEMENT.md are in this folder — please read both files in full before starting. Pay special attention to PRD section 9 (Technical stack), section 10 (File structure), and section 5 (Grok API integration).

Scaffold the project using Vite + React 18 + TypeScript + Tailwind CSS exactly as specified. Set up:

1. Initialize package.json with the right dependencies
2. Vite configuration
3. TypeScript with strict mode
4. Tailwind with a custom theme extending the color palette from PRD section 7
5. The full /src folder structure from PRD section 10 — create all the component files, hook files, lib files, and types files, but leave the contents as minimal stubs (e.g., a basic React component returning a div with the component name)
6. The /api/backbone.ts file as a stub Vercel Edge Function
7. A .env.example file (NOT .env — that comes later)
8. .gitignore that excludes node_modules, .env, .env.local, and dist
9. A minimal README.md (we'll expand it later)

Verify:
- npm install runs cleanly
- npm run dev starts the dev server on localhost:5173
- The page loads (even if it's just a placeholder)

When done, list every file you created and confirm everything is wired up. Don't write any component logic yet.
```

### Verify before moving on
- [ ] `npm run dev` starts without errors
- [ ] `localhost:5173` loads a page (even a blank one)
- [ ] All files from PRD section 10 exist (check the file structure)
- [ ] `.env` is gitignored, `.env.example` exists with `GROK_API_KEY=` placeholder
- [ ] Tailwind config has the custom color tokens from PRD section 7

### Common issues
- If Tailwind isn't applying styles: check `tailwind.config.js` content paths include `./src/**/*.{ts,tsx}`
- If TypeScript complains about JSX: ensure `tsconfig.json` has `"jsx": "react-jsx"`
- If Vite can't find the entry point: check `index.html` references `/src/main.tsx`

---

## Phase 2 — ChatGPT-faithful static layout (2-3 hours)

### Goal
The visual shell of the app — sidebar, header, message area, input bar, quick-prompt buttons. ChatGPT-faithful styling. No API calls yet, no Backbone features yet, no animations.

### Prompt to send

```
Now build the static layout — the ChatGPT-faithful shell. Reference PRD section 7 (ChatGPT visual fidelity) extensively.

Build the following components with full styling:

1. Sidebar.tsx — 260px wide, fixed left, dark background, "New chat" button, three decorative conversation entries, user avatar at bottom
2. Header.tsx — "ChatGPT" with dropdown chevron, Share and "..." icons on the right
3. ChatArea.tsx — main message container, centered, max-width 768px
4. UserMessage.tsx — right-aligned bubble with the preset's prompt text
5. InputBar.tsx — visible but disabled, ChatGPT-styled, with attachment/voice/send icons, "Message ChatGPT..." placeholder
6. PresetPrompts.tsx — 4 preset buttons in a 2x2 grid, placed above the input bar; reference PRD section 4 for the 4 presets and PRD section 7 for the button styling

Wire up App.tsx to render this complete layout. The page should look exactly like ChatGPT's interface with the 4 preset buttons visible. No actual interactions yet — clicking presets does nothing.

Use the exact colors, typography, and spacing from PRD section 7. Use Inter font (via Google Fonts or self-hosted). Use Lucide React for icons.

When done, run npm run dev and walk me through what's visible at localhost:5173.
```

### Verify before moving on
- [ ] Visual matches ChatGPT 2025's interface closely
- [ ] Four preset buttons render with labels from PRD section 4
- [ ] Sidebar, header, and input bar all look correct
- [ ] Colors and typography match the PRD
- [ ] No console errors

### Iteration tip
If the layout doesn't quite look right, send a follow-up with screenshots and specific adjustments: "The sidebar background is too light — should be #171717. The preset buttons need more padding." Don't try to fix everything in one go.

---

## Phase 3 — Static Backbone features (2-3 hours)

### Goal
The four Backbone components (ReasoningTrace, MainAnswer, ConfidenceMarker, AssumptionsBlock, SelfCritiqueFooter, IssueCard) built and styled. Use hardcoded sample data for now. No animation yet, no API yet, but all interactions work (collapse/expand reasoning, expand/collapse self-critique).

### Prompt to send

```
Now build all the Backbone feature components with full styling and interaction logic. Reference PRD section 6 (the four Backbone features) for rendering specs.

Components to build:

1. BackboneResponse.tsx — the parent component that contains all four features
2. ReasoningTrace.tsx — collapsible block with three numbered reasoning steps; defaults expanded; "hide reasoning"/"show reasoning" toggle
3. MainAnswer.tsx — renders prose text with inline confidence markers positioned at matched substring locations
4. ConfidenceMarker.tsx — the inline pill component; takes level (UNVERIFIED/MEDIUM/HIGH) and reason; shows tooltip on hover
5. AssumptionsBlock.tsx — header + two assumption tags with edit pencil icons
6. SelfCritiqueFooter.tsx — collapsed view (3 bullets + subtitle); clicking expands to show three IssueCard components; "Collapse" link returns to bullet view
7. IssueCard.tsx — colored left-border, type label, title, explanation, action button

Use hardcoded sample data from PRD section 4 Preset 1 (the remote work productivity scenario) for testing. The full sample data:

reasoning_steps: [
  "Looked for recent peer-reviewed studies on remote work outcomes",
  "Cross-referenced with industry surveys and meta-analyses",
  "Considered variation by role, seniority, and team structure"
]

main_answer: "Research on remote work productivity since 2020 paints a nuanced picture. A widely cited Stanford study reported measurable productivity differences between remote and in-office workers. Worker self-reported focus tends to be higher at home, particularly for deep, individual tasks. The most consistent finding across meta-analyses is that remote work effects vary substantially by role, task type, and team structure."

assumptions: [
  "Assumes post-2020 data",
  "Assumes general knowledge workers, not specific roles"
]

confidence_markers: [
  { claim_substring: "widely cited Stanford study", level: "UNVERIFIED", reason: "Couldn't confirm specific study in training data" },
  { claim_substring: "Worker self-reported focus", level: "MEDIUM", reason: "Self-report data; methodology varies" },
  { claim_substring: "effects vary substantially by role", level: "HIGH", reason: "Consistently supported across meta-analyses" }
]

issues: [
  { type: "SOURCE_VERIFICATION_NEEDED", title: "Specific study citations should be verified against original sources", explanation: "The cited Stanford study on remote work productivity could not be confirmed in training data.", action_label: "Search for source" },
  { type: "EVIDENCE_OVERREACH", title: "Conclusion is stronger than the evidence supports", explanation: "The summary moved from 'remote workers performed comparably' to broader conclusions not supported by the cited evidence.", action_label: "Show the original evidence" },
  { type: "MISSING_CONTEXT", title: "Effects vary significantly by role", explanation: "Remote work outcomes differ significantly by job type, seniority, and team structure. This summary generalizes.", action_label: "What context is missing?" }
]

Build a utility function in src/lib/matchClaim.ts that takes the main_answer text and a list of confidence_markers, and returns the rendered text with pill components inserted at the right substring positions.

Connect the static data to BackboneResponse so it renders in App.tsx. The Backbone response should display below the user message when a preset is clicked (use temporary state — click preset → show the response with the hardcoded data).

All interactions should work: reasoning trace collapses/expands, self-critique footer expands/collapses, pill tooltips show on hover, action buttons in issue cards are visible (clicks can console.log for now).

Run npm run dev and walk me through what's visible.
```

### Verify before moving on
- [ ] All four Backbone features visible and correctly styled
- [ ] Reasoning trace expands/collapses
- [ ] Self-critique footer expands to show three issue cards
- [ ] Confidence pills are anchored at the correct substring positions in the main answer text
- [ ] Pill tooltips show the evaluator's reason on hover
- [ ] Issue cards show color-coded left borders
- [ ] All four buttons in PresetPrompts still trigger the same hardcoded response (we'll wire to API in Phase 4)

---

## Phase 4 — Grok API integration (3-4 hours)

### Goal
Replace the hardcoded sample data with real Grok API calls. Backend route handles two passes (generation + evaluation), streams responses to the frontend, and returns structured Backbone data.

### Sub-phase 4a: Backend route (1-2 hours)

### Prompt to send

```
Now build the backend route that calls Grok's API. Reference PRD section 5 (Grok API integration) extensively.

Build /api/backbone.ts as a Vercel Edge Function with the following behavior:

1. Accepts POST requests with body { promptId: string, promptText: string }
2. Reads GROK_API_KEY from process.env (must NOT be exposed to client)
3. Step 1: Generation pass — call Grok-4 with the generator system prompt from PRD section 5; stream response
4. Step 2: Once generation completes, parse the JSON; if parsing fails, fall back to /src/data/fallbackResponses.ts
5. Step 3: Evaluation pass — call Grok-4-Fast with the evaluator system prompt from PRD section 5, passing the generated response as the user message; receive evaluator JSON
6. Step 4: Combine the two responses into a single JSON object and stream it back to the frontend

For streaming back to the frontend, use Server-Sent Events. The frontend should be able to receive partial data:
- First, receive the generation pass's reasoning_steps array (so it can render Stage 1)
- Then, receive the streamed main_answer as it arrives (so it can render Stage 2's typewriter)
- Then, receive the generation pass's assumptions array (Stage 4 setup)
- Finally, receive the evaluation pass's confidence_markers and issues (Stages 3 and 5)

Define the TypeScript types in src/types/backbone.ts for:
- BackboneRequest (the POST body)
- GenerationResponse (the structured output from generation pass)
- EvaluationResponse (the structured output from evaluation pass)
- BackboneResponse (the combined object sent to frontend)

Add a .env.local file with my Grok API key (I'll add the key value after you create the file). Make sure .env.local is gitignored.

For local testing, you can either:
- Use Vercel CLI (vercel dev) to test the edge function locally
- Or set up a simple Express dev server in parallel for local development

Recommend whichever is faster. Walk me through how to test it locally before we wire it to the frontend.
```

### Sub-phase 4b: Frontend wiring (1-2 hours)

After the backend route works, send this prompt:

```
Now wire the frontend to call /api/backbone when a preset is clicked.

Build src/hooks/useBackboneStream.ts:
- Takes a promptId and promptText
- POSTs to /api/backbone
- Parses the streaming response progressively
- Returns state: { stage: 0|1|2|3|4|5|6, reasoning_steps, main_answer, assumptions, confidence_markers, issues, error }
- Stage transitions are triggered by which fields have arrived from the stream

Wire PresetPrompts.tsx so that clicking a preset:
1. Triggers useBackboneStream with the preset's promptId and promptText
2. Renders the BackboneResponse with the streaming data
3. Disables other preset clicks while a response is in flight

Replace the hardcoded data in BackboneResponse.tsx with the streaming data from the hook.

Implement caching: after a preset successfully returns, store its full response in memory. Clicking Replay (which we'll build in Phase 5) should use the cached response, not re-call the API.

Error handling: if the API returns an error, render an error message in the response area with a Retry button. Test this by temporarily setting an invalid API key.

After this is wired, walk me through the full flow: click a preset → API call → response renders with all features.
```

### Verify before moving on
- [ ] Clicking any of the four presets triggers a real Grok API call
- [ ] The response renders with real Grok-generated content (not the hardcoded sample)
- [ ] All four Backbone features populate from the API response
- [ ] Confidence markers are anchored at substring positions returned by the evaluator
- [ ] API key is NOT exposed in the client bundle (check the network tab in dev tools)
- [ ] Errors render gracefully (test by temporarily breaking the API key)

### Common issues
- If the JSON returned by Grok is malformed: the evaluator system prompt may need refinement. Iterate on the system prompts in PRD section 5 until Grok reliably returns valid JSON.
- If confidence_markers' claim_substring doesn't match the rendered main_answer text: the evaluator may be paraphrasing claims rather than copying verbatim. Strengthen the system prompt instruction.
- If streaming feels too fast or too slow: real LLM streaming is what it is — don't try to slow it down artificially.

---

## Phase 5 — Sequential reveal animation (2-3 hours)

### Goal
The six-stage animation kicks in as the real streaming response arrives. Replay button works (re-renders from cache without new API call).

### Prompt to send

```
Now layer in the sequential reveal animation. Reference PRD section 8 (Sequential reveal animation).

Build src/hooks/useSequentialReveal.ts:
- Takes the current streaming state from useBackboneStream
- Determines the current stage based on which fields have arrived
- Returns visibility flags for each stage's components

Update each Backbone component to use opacity + transform transitions:
- ReasoningTrace: fades + slides up from 20px below when stage >= 1
- MainAnswer: word-by-word visibility tied to streaming word arrival (Stage 2)
- ConfidenceMarker: each pill fades in with subtle scale (0.85→1.0), staggered 250ms apart, when stage >= 3
- AssumptionsBlock: fades + slides up when stage >= 4
- SelfCritiqueFooter: fades + slides up when stage >= 5

All animations:
- Easing: cubic-bezier(0.4, 0.0, 0.2, 1)
- Duration: 600ms for fade-in/slide-up, 200ms for confidence pill scale
- Use CSS transitions, NOT animation libraries

Add src/hooks/useReducedMotion.ts that detects prefers-reduced-motion. When set, skip all transitions and show stages immediately.

Build the ReplayButton component:
- Small button in the top-right of BackboneResponse, with a refresh icon and "Replay" text
- Clicking resets all visibility flags and re-runs the animation from Stage 0 using the cached response (does NOT call the API again)

Make sure the typewriter effect for MainAnswer uses actual word arrival from the stream, not faked timing.

After this is wired, walk me through the visual flow when a preset is clicked.
```

### Verify before moving on
- [ ] Clicking a preset triggers a clean six-stage animation
- [ ] Reasoning trace appears first
- [ ] Main answer streams word-by-word as Grok returns it
- [ ] Confidence pills fade in after streaming completes, staggered
- [ ] Assumptions block fades in next
- [ ] Self-critique footer fades in last
- [ ] Replay button resets and re-runs the animation using cached data
- [ ] `prefers-reduced-motion` is honored (test in your OS settings)

---

## Phase 6 — Polish and edge cases (1-2 hours)

### Goal
The prototype feels finished. Edge cases handled. UI micro-interactions feel refined.

### Prompt to send

```
Final polish pass. Address the following:

1. Micro-interactions:
   - All buttons have subtle hover states (background lightens by ~5%)
   - Focus rings on all interactive elements (2px solid green at 50% opacity)
   - Smooth transitions on collapse/expand of reasoning trace and self-critique footer
   - Smooth chevron rotation on collapsibles
   - Replay button has a subtle rotation animation on hover

2. Loading states:
   - When a preset is clicked, the preset button itself shows a small spinner during the API call
   - Loading dots in the response area animate smoothly (three dots with sequential opacity)
   - Other presets are visually disabled during a response

3. Error states:
   - API failures show a clear message with a retry button
   - Malformed JSON from Grok falls back to /src/data/fallbackResponses.ts (build that file with one pre-stored response per preset)
   - Network timeouts handled gracefully

4. Edge case: very long main_answer text:
   - Ensure the response area scrolls smoothly if content exceeds viewport
   - Sticky scroll-to-bottom while streaming (so users see new words as they appear)

5. Empty state:
   - Before any preset is clicked, the assistant response area shows a brief friendly message like "Click a prompt below to see Backbone in action"

6. Accessibility:
   - All interactive elements have aria-labels
   - Tab navigation works through preset buttons and Backbone interactions
   - Confidence pill tooltips are keyboard-accessible (Tab + space)

7. Console hygiene:
   - No console errors or warnings
   - Remove any debug console.logs

Run npm run dev one more time and walk me through the full polished experience. Make a checklist of any rough edges you noticed.
```

### Verify before moving on
- [ ] Hover states feel smooth across all interactive elements
- [ ] Focus rings are visible and consistent
- [ ] Loading states are clean (no flashes, no jumps)
- [ ] Error states are graceful with retry options
- [ ] Long responses scroll smoothly
- [ ] No console errors or warnings
- [ ] Empty state has a friendly hint

---

## Phase 7 — Deploy and README (45 minutes)

### Goal
The prototype is publicly live on Vercel with a clean README in the GitHub repo.

### Sub-phase 7a: GitHub setup

### Prompt to send

```
We're ready to deploy. Walk me through:

1. Initializing git in this folder
2. Creating a public GitHub repo (manual on github.com — you give me the steps)
3. Adding the remote and pushing
4. Make sure .env.local is NOT in the push (verify .gitignore is working)

Generate a high-quality README.md for the public repo with these sections:

- Project title and one-paragraph description (use PROBLEM_STATEMENT.md for context)
- Live demo link (placeholder for now — I'll add it after Vercel deploy)
- Three screenshots (placeholders — I'll add the actual screenshots after deploy)
- Tech stack list
- Quick start (clone, install, env setup, dev)
- Environment variables section explaining GROK_API_KEY setup
- Project structure (a tree, simplified from PRD section 10)
- A "How it works" section briefly describing the two-pass architecture (generation + separate evaluation)
- "What this prototype is NOT" section pulled from PRD section 12
- Acknowledgments (case study brief, research participants)
- License (MIT recommended)

Don't include the full PRD or PROBLEM_STATEMENT inside the README — link to them as files in the repo.
```

### Sub-phase 7b: Vercel deploy

### Prompt to send

```
Now walk me through deploying to Vercel:

1. Sign in to vercel.com with my GitHub account
2. Import the backbone-prototype repo
3. Configure environment variables in Vercel (specifically GROK_API_KEY)
4. Deploy

Tell me exactly what to do step by step, including:
- Which framework preset to choose during import (Vite)
- How to add GROK_API_KEY in Vercel's environment variables UI
- How to test that the deployed version actually works
- How to set up automatic redeployment on git push

After it's deployed, give me the URL pattern I should expect, then walk me through testing each of the four presets on the live URL.
```

### Sub-phase 7c: Final updates

After deploy:

1. Add the live URL to the README's "Live demo" section
2. Take screenshots of the three key states (empty, full Backbone response, expanded critique)
3. Add the screenshots to the README and to the GitHub repo's /screenshots folder
4. Push the README updates to GitHub (Vercel auto-deploys)
5. Update your case study deck's slide 8 PROTOTYPE chip to point to the new Vercel URL

### Verify before moving on
- [ ] GitHub repo is public
- [ ] README is clean, well-formatted, and complete
- [ ] Vercel deployment is live
- [ ] GROK_API_KEY is set in Vercel env vars (not in any code)
- [ ] All four presets work on the live URL
- [ ] Live URL loads without authentication
- [ ] Deck slide 8's PROTOTYPE chip points to the new URL

---

## Total time estimate

| Phase | Time |
|-------|------|
| 0 — Setup | 15 min |
| 1 — Scaffold | 30 min |
| 2 — Static layout | 2-3 hr |
| 3 — Backbone features (static) | 2-3 hr |
| 4 — Grok API integration | 3-4 hr |
| 5 — Animation | 2-3 hr |
| 6 — Polish | 1-2 hr |
| 7 — Deploy & README | 45 min |
| **Total** | **~12-16 hr** |

Spread across 3-4 working sessions if you're balancing this with the deck.

---

## Things to watch out for

**Phase 1 — Grok package vs OpenAI SDK.** Grok's API is OpenAI-compatible, so you can use the OpenAI SDK pointed at Grok's endpoint. If Claude Code installs `xai-sdk` or similar, that's also fine — but the OpenAI SDK is more battle-tested.

**Phase 4 — System prompt iteration.** The system prompts in PRD section 5 are starting points. You may need to refine them based on what Grok actually produces. If the evaluator returns inconsistent JSON, strengthen the instruction with explicit examples in the system prompt.

**Phase 4 — Cost monitoring.** Set the Grok API usage cap to a small amount ($20-50) before testing. The two-model pipeline means each request makes 2 API calls. During heavy testing you could burn through $5-10 in a single session.

**Phase 5 — Streaming complexity.** Real streaming is genuinely tricky. If Phase 5 gets stuck, the fallback is to remove the typewriter effect and just fade in the main answer all at once. The brief doesn't require streaming; it's a polish feature.

**Phase 6 — Don't over-polish.** Resist the urge to redesign halfway. The PRD specs the design system — implement it as written. If something feels off after Phase 6 completes, make it a v2 issue, not a v1 blocker.

**Phase 7 — Vercel and Edge Functions.** Make sure the /api/backbone route is set to run as an Edge Function in Vercel's config, not a regular Serverless Function. Edge functions have lower latency and better streaming support.

---

## When to fall back to the Bolt prototype

If by the end of Phase 4 (the Grok API integration) you've hit blockers you can't resolve in 4+ hours of debugging, fall back to your existing Bolt prototype. The Bolt version is good enough for the deck submission. Don't sacrifice the deadline for a more ambitious prototype that doesn't ship.

Honest cutoff signals:
- The two-pass API architecture isn't producing reliable JSON after multiple system prompt iterations
- Streaming responses are breaking in production but working locally
- Vercel deploy is throwing errors you can't decode

If any of those persist past 4 hours of fixing: ship Bolt, move on.
