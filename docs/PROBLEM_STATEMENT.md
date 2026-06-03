# Problem Statement — Backbone

## The problem

People are using ChatGPT for genuinely consequential work — research, code, career decisions, business analysis — and trusting outputs that *look* polished without being able to tell when that polish is earned. ChatGPT reached over 900M weekly active users in February 2026, but its responses sound equally confident whether the underlying reasoning is solid or shaky. Trust is being formed on the wrong cues: formatting, fluency, citation count. Not on whether the reasoning actually holds.

The data is consistent. In primary research conducted as part of the AI Product Management Fellowship case study (33-response survey + 6 in-depth interviews):

- **58%** of users trust output *more* when it looks well-formatted and polished — the single biggest driver of false confidence
- **84%** caught a serious error in an AI output *only after* they'd already used or shared it
- **82%** are miscalibrated in some direction — they over-trust polished output, over-check fine output, or both — only 18% calibrate well
- **4 of 6 interviewees** independently asked, unprompted, for the same fix: visible reasoning, surfaced assumptions, flagged uncertainty, and self-critique

The pattern is durable. Users aren't lacking judgment. They're lacking the *signals to judge with*.

## Who Backbone is for

The target segment is **working professionals — intermediate-to-advanced daily AI users doing high-stakes knowledge work (research, coding, career prep) — whose trust in polished output outruns their ability to verify it.** This is roughly 61% of the surveyed sample, and aligns with ChatGPT's largest age cohort (25-34) by publicly reported demographics.

Two representative personas emerged from interviews:

**The Confident Builder.** Mid-skill, builds and configures things, uses AI as a thinking partner. Has been burned by confidently-wrong technical details and now verifies actively when stakes are high — but the verification is laborious. Wants reasoning and sources, not confidence scores.

**The Frustrated Heavy User.** Daily reliance across writing, research, career. Oscillates between accepting outputs blindly and exhausting iteration loops trying to course-correct. Wants AI that pushes back — that flags when it's unsure rather than agreeing with her.

## Why existing tools don't solve it

Each major AI assistant surfaces *one signal* but none lets the user calibrate trust on a per-output basis:

- **ChatGPT** — Inline citations and Thinking mode, but sounds confident even when wrong; citations are often inaccurate or fabricated
- **Claude** — Refuses uncertain claims, but a refusal isn't a trust level — users can't act on "I don't know" the same way they can on "trust this 70%"
- **Gemini** — Source links and Workspace grounding, but produces confident hallucinations with no visible uncertainty
- **Perplexity** — Best-in-class citations, but built as a search tool — weighs source presence, not reasoning quality

Each gives you a *piece* of trust. None tells you *how much* to trust *this specific output*, or where its reasoning is weak.

## The brief's explicit constraints

This prototype demonstrates a solution conforming to the case study's brief. Worth preserving in implementation:

**Must do:**
- Help users *evaluate AI output quality* and *build calibrated confidence*
- Address both failure modes: over-trust *and* over-skepticism
- Make reasoning legible
- Keep the user in control of judgment — surface signals, don't replace judgment with scores
- Avoid becoming "another opaque black box" where the user has to trust the trust layer on faith

**Must NOT do (explicit rejected approaches from the brief):**
- Basic hallucination detection alone
- Fact-checking alone
- Generic "trust scores" without reasoning
- Cosmetic UI improvements that don't change underlying behavior

## What success looks like

The prototype is a working demonstration where a user can:

1. **Land** on a ChatGPT-faithful interface and immediately understand the context
2. **Click** one of four preset prompts spanning different real-world scenarios (research, technical explanation, decision-making, work analysis)
3. **Watch** Backbone build its response in real time — reasoning trace appearing first, then the streamed answer with inline confidence markers, then surfaced assumptions, then the self-critique footer
4. **Drill** into any flagged issue to see *why* it was flagged and what to do about it
5. **Repeat** with other prompts to see how Backbone adapts to different content types

The technical architecture demonstrably separates the *generator* (the model that writes the answer) from the *evaluator* (a different model instance that produces the critique), with the user able to see both outputs and the reasoning behind every signal. That separation is what makes Backbone defensible against the "another black box" critique.
