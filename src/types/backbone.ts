export interface BackboneRequest {
  promptId: string
  promptText: string
}

export interface GenerationResponse {
  reasoning_steps: string[]
  main_answer: string
  assumptions: string[]
}

export interface ConfidenceMarker {
  claim_substring: string
  level: 'UNVERIFIED' | 'MEDIUM' | 'HIGH'
  reason: string
}

export interface Issue {
  type: 'SOURCE_VERIFICATION_NEEDED' | 'EVIDENCE_OVERREACH' | 'MISSING_CONTEXT'
  title: string
  explanation: string
  action_label: string
}

export interface EvaluationResponse {
  confidence_markers: ConfidenceMarker[]
  issues: Issue[]
}

export interface BackboneResponseData {
  reasoning_steps: string[]
  main_answer: string
  assumptions: string[]
  confidence_markers: ConfidenceMarker[]
  issues: Issue[]
}

export type StreamStage = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface StreamState {
  stage: StreamStage
  reasoning_steps: string[]
  main_answer: string
  assumptions: string[]
  confidence_markers: ConfidenceMarker[]
  issues: Issue[]
  error: string | null
}
