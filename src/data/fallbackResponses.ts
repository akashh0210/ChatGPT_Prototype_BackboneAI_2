import { BackboneResponseData } from '../types/backbone'

export const fallbackResponses: Record<string, BackboneResponseData> = {
  'preset-1': {
    reasoning_steps: [
      'Looked for recent peer-reviewed studies on remote work outcomes',
      'Cross-referenced with industry surveys and meta-analyses',
      'Considered variation by role, seniority, and team structure',
    ],
    main_answer:
      'Research on remote work productivity since 2020 paints a nuanced picture. A widely cited Stanford study reported measurable productivity differences between remote and in-office workers. Worker self-reported focus tends to be higher at home, particularly for deep, individual tasks. The most consistent finding across meta-analyses is that remote work effects vary substantially by role, task type, and team structure.',
    assumptions: ['Assumes post-2020 data', 'Assumes general knowledge workers, not specific roles'],
    confidence_markers: [
      { claim_substring: 'widely cited Stanford study', level: 'UNVERIFIED', reason: "Couldn't confirm specific study in training data" },
      { claim_substring: 'Worker self-reported focus', level: 'MEDIUM', reason: 'Self-report data; methodology varies' },
      { claim_substring: 'effects vary substantially by role', level: 'HIGH', reason: 'Consistently supported across meta-analyses' },
    ],
    issues: [
      {
        type: 'SOURCE_VERIFICATION_NEEDED',
        title: 'Specific study citations should be verified against original sources',
        explanation: 'The cited Stanford study on remote work productivity could not be confirmed in training data.',
        action_label: 'Search for source',
      },
      {
        type: 'EVIDENCE_OVERREACH',
        title: 'Conclusion is stronger than the evidence supports',
        explanation: "The summary moved from 'remote workers performed comparably' to broader conclusions not supported by the cited evidence.",
        action_label: 'Show the original evidence',
      },
      {
        type: 'MISSING_CONTEXT',
        title: 'Effects vary significantly by role',
        explanation: 'Remote work outcomes differ significantly by job type, seniority, and team structure. This summary generalizes.',
        action_label: 'What context is missing?',
      },
    ],
  },
  'preset-2': {
    reasoning_steps: [
      'Considered architectural differences between RAG and fine-tuning',
      'Evaluated cost, latency, and data requirements for each approach',
      'Applied startup constraints: limited data, budget, and iteration speed',
    ],
    main_answer:
      "RAG retrieves relevant documents at inference time and injects them into the prompt, while fine-tuning adjusts the model's weights using domain-specific training data. For most startups, RAG is the right first choice — it requires no training pipeline, works with evolving data, and is far cheaper to maintain. Fine-tuning makes sense when you have thousands of high-quality examples and need the model to internalize style or domain vocabulary that retrieval can't capture.",
    assumptions: ['Assumes the startup has limited labeled training data', 'Assumes cost and speed of iteration are priorities'],
    confidence_markers: [
      { claim_substring: "adjusts the model's weights", level: 'HIGH', reason: 'Technically accurate description of fine-tuning' },
      { claim_substring: 'RAG is the right first choice', level: 'MEDIUM', reason: 'Contextually reasonable but depends on use case' },
      { claim_substring: 'thousands of high-quality examples', level: 'MEDIUM', reason: 'Rule of thumb varies widely by domain and model size' },
    ],
    issues: [
      {
        type: 'MISSING_CONTEXT',
        title: 'Recommendation ignores the specific domain',
        explanation: "Some domains (medical, legal) may require fine-tuning for compliance reasons regardless of data size.",
        action_label: 'What context is missing?',
      },
      {
        type: 'EVIDENCE_OVERREACH',
        title: "Framing RAG as 'right first choice' is too absolute",
        explanation: 'There are scenarios — like offline deployments or strict latency requirements — where RAG is impractical.',
        action_label: 'Show the original evidence',
      },
      {
        type: 'MISSING_CONTEXT',
        title: 'Hybrid approaches not mentioned',
        explanation: 'Many production systems combine both RAG and fine-tuning; the binary framing may mislead.',
        action_label: 'What context is missing?',
      },
    ],
  },
  'preset-3': {
    reasoning_steps: [
      'Identified the key trade-off axes: compensation vs. stability, growth vs. title',
      'Considered standard career advice frameworks for early vs. mid career',
      'Noted the critical missing context: personal financial situation and career stage',
    ],
    main_answer:
      "This decision depends heavily on your career stage and financial situation — two things I don't know. If you're early-career, the top-tier firm's brand and mentorship network typically outweigh the pay gap. If you're mid-career with financial obligations, the 30% premium may matter more. The 'less stable' framing for Job A deserves scrutiny: is it a funded startup, or a declining business? Those carry very different risk profiles.",
    assumptions: ["Assumes 'top-tier firm' means strong mentorship and network access", 'Assumes the user is weighing long-term career vs. short-term income'],
    confidence_markers: [
      { claim_substring: "top-tier firm's brand and mentorship network", level: 'MEDIUM', reason: "Generalizes about 'top-tier' without knowing the specific firm" },
      { claim_substring: "funded startup, or a declining business", level: 'HIGH', reason: 'This distinction is well-established in risk assessment frameworks' },
      { claim_substring: 'outweigh the pay gap', level: 'UNVERIFIED', reason: 'No cited evidence; depends entirely on individual circumstances' },
    ],
    issues: [
      {
        type: 'MISSING_CONTEXT',
        title: 'Recommendation requires personal context that was not provided',
        explanation: "The advice pivots on career stage and financial obligations — neither was stated in the question.",
        action_label: 'What context is missing?',
      },
      {
        type: 'EVIDENCE_OVERREACH',
        title: "Early-career brand value claim is too confident",
        explanation: 'The value of brand names varies significantly by industry, geography, and the specific firm.',
        action_label: 'Show the original evidence',
      },
      {
        type: 'MISSING_CONTEXT',
        title: 'Role quality and manager not addressed',
        explanation: 'The quality of your direct manager and the actual work often matter more than company tier or pay.',
        action_label: 'What context is missing?',
      },
    ],
  },
  'preset-4': {
    reasoning_steps: [
      'Identified the strategic claims: focus on accuracy and speed as differentiators',
      'Evaluated whether these are defensible moats in healthcare AI',
      'Considered what the strategy omits: regulatory, distribution, and trust factors',
    ],
    main_answer:
      "This strategy has a shallow moat problem. 'Superior accuracy and faster responses' are table-stakes in mature AI markets, not durable differentiators — every competitor will claim the same. In healthcare specifically, the actual barriers to adoption are regulatory approval (FDA clearance or CE marking), liability frameworks, and institutional trust built through clinical validation studies. The strategy also conflates 'AI assistant' with a specific use case — healthcare spans wildly different problems, and 'leading AI assistant' in the space is too vague to execute against.",
    assumptions: ['Assumes a US or EU healthcare regulatory environment', "Assumes 'AI assistant' targets clinical or administrative workflows, not consumer health"],
    confidence_markers: [
      { claim_substring: 'table-stakes in mature AI markets', level: 'HIGH', reason: 'Consistent with competitive dynamics literature on feature parity' },
      { claim_substring: 'FDA clearance or CE marking', level: 'HIGH', reason: 'Regulatory requirements are well-established and publicly documented' },
      { claim_substring: 'institutional trust built through clinical validation', level: 'MEDIUM', reason: 'True in principle but implementation paths vary by product type' },
    ],
    issues: [
      {
        type: 'MISSING_CONTEXT',
        title: 'No go-to-market or distribution strategy mentioned',
        explanation: 'Healthcare AI adoption is gated by hospital procurement cycles and EHR integrations, not product quality alone.',
        action_label: 'What context is missing?',
      },
      {
        type: 'EVIDENCE_OVERREACH',
        title: "Critique assumes 'healthcare' means clinical settings",
        explanation: 'If the target is direct-to-consumer health or wellness, the regulatory and competitive landscape is entirely different.',
        action_label: 'Show the original evidence',
      },
      {
        type: 'SOURCE_VERIFICATION_NEEDED',
        title: 'Claim about FDA clearance requirements needs verification for specific use case',
        explanation: 'Not all healthcare AI tools require FDA clearance — it depends heavily on the intended use and risk classification.',
        action_label: 'Search for source',
      },
    ],
  },
}
