import { ConfidenceMarker as ConfidenceMarkerType } from '../types/backbone'

interface Props {
  marker: ConfidenceMarkerType
  index?: number
}

const styles: Record<ConfidenceMarkerType['level'], { bg: string; border: string; text: string }> = {
  UNVERIFIED: { bg: 'rgba(217,119,87,0.2)', border: 'rgba(217,119,87,0.4)', text: '#D97757' },
  MEDIUM:     { bg: 'rgba(229,161,85,0.2)',  border: 'rgba(229,161,85,0.4)',  text: '#E5A155' },
  HIGH:       { bg: 'rgba(16,163,127,0.2)',  border: 'rgba(16,163,127,0.4)', text: '#10A37F' },
}

export default function ConfidenceMarker({ marker, index = 0 }: Props) {
  const s = styles[marker.level]
  return (
    <span className="group relative inline-block align-middle mx-0.5">
      <span
        className="inline-block px-2 py-0.5 rounded-xl text-[11px] font-medium uppercase tracking-wide cursor-default border"
        style={{
          backgroundColor: s.bg, borderColor: s.border, color: s.text,
          animation: 'markerScaleIn 200ms cubic-bezier(0.4, 0, 0.2, 1) both',
          animationDelay: `${index * 250}ms`,
        }}
        data-marker-anim
        tabIndex={0}
        aria-label={`${marker.level}: ${marker.reason}`}
      >
        {marker.level}
      </span>
      <span
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                   opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
                   transition-opacity duration-150
                   px-3 py-2 text-xs text-[#ECECEC] bg-[#2F2F2F] border border-white/10
                   rounded-lg whitespace-nowrap z-20 shadow-lg max-w-[240px] text-center"
        style={{ whiteSpace: 'normal', width: 'max-content', maxWidth: '220px' }}
        role="tooltip"
      >
        {marker.reason}
        <span
          className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent"
          style={{ borderTopColor: 'rgba(255,255,255,0.14)' }}
        />
      </span>
    </span>
  )
}
