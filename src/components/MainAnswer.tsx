import { ConfidenceMarker as ConfidenceMarkerType } from '../types/backbone'
import ConfidenceMarker from './ConfidenceMarker'
import { matchClaims } from '../lib/matchClaim'

interface Props {
  text: string
  markers: ConfidenceMarkerType[]
  isStreaming?: boolean
}

export default function MainAnswer({ text, markers, isStreaming = false }: Props) {
  const segments = matchClaims(text, markers)

  return (
    <div className="text-[15px] text-[#ECECF1] leading-[1.75] mb-5">
      {segments.map((seg, i) =>
        seg.marker ? (
          <span key={i}>
            {seg.text}<ConfidenceMarker marker={seg.marker} index={seg.markerIndex} />
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
      {isStreaming && (
        <span
          className="inline-block w-[2px] h-[1em] bg-[#ECECF1] align-middle ml-px"
          style={{ animation: 'cursorBlink 800ms step-end infinite' }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
