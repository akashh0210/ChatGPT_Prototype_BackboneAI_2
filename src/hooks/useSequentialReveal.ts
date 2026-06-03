import { StreamState, StreamStage } from '../types/backbone'

export interface RevealFlags {
  showReasoning: boolean
  showAnswer: boolean
  showMarkers: boolean
  showAssumptions: boolean
  showCritique: boolean
}

export function useSequentialReveal(state: StreamState): RevealFlags {
  return {
    showReasoning: state.stage >= 1,
    showAnswer: state.stage >= 2,
    showMarkers: state.stage >= 3,
    showAssumptions: state.stage >= 4,
    showCritique: state.stage >= 5,
  }
}

export type { StreamStage }
