import { StreamState } from '../types/backbone'
import ReasoningTrace from './ReasoningTrace'
import MainAnswer from './MainAnswer'
import AssumptionsBlock from './AssumptionsBlock'
import SelfCritiqueFooter from './SelfCritiqueFooter'
import ReplayButton from './ReplayButton'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  state: StreamState
  onReplay: () => void
}

export default function BackboneResponse({ state, onReplay }: Props) {
  if (state.error) {
    return (
      <div className="flex flex-col items-start gap-3 py-4">
        <div className="flex items-center gap-2 text-[#D97757]">
          <AlertCircle size={16} />
          <p className="text-[14px]">Couldn't reach Groq — {state.error}</p>
        </div>
        <button
          onClick={onReplay}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] border border-white/10 text-[#AFAFAF] hover:text-[#ECECEC] hover:border-white/25 hover:bg-[#2F2F2F] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          <RefreshCw size={13} />
          Retry
        </button>
      </div>
    )
  }

  const showReasoning = state.stage >= 1 && state.reasoning_steps.length > 0
  const showAnswer    = state.stage >= 2 && state.main_answer.length > 0
  const showMarkers   = state.stage >= 3
  const showAssumptions = state.stage >= 4 && state.assumptions.length > 0
  const showCritique  = state.stage >= 5 && state.issues.length > 0

  return (
    <div className="mb-8">
      {state.stage >= 2 && (
        <div className="flex justify-end mb-3">
          <ReplayButton onReplay={onReplay} />
        </div>
      )}

      {showReasoning && <ReasoningTrace steps={state.reasoning_steps} />}

      {showAnswer && (
        <MainAnswer
          text={state.main_answer}
          markers={showMarkers ? state.confidence_markers : []}
          isStreaming={state.stage === 2}
        />
      )}

      {showAssumptions && <AssumptionsBlock assumptions={state.assumptions} />}

      {showCritique && <SelfCritiqueFooter issues={state.issues} />}
    </div>
  )
}
