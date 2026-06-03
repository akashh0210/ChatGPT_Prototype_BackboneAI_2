import { Issue } from '../types/backbone'

interface Props {
  issue: Issue
}

const typeStyles: Record<Issue['type'], { border: string; label: string; btnBorder: string; btnText: string }> = {
  SOURCE_VERIFICATION_NEEDED: { border: '#D97757', label: '#D97757', btnBorder: '#D97757', btnText: '#D97757' },
  EVIDENCE_OVERREACH:         { border: '#E5A155', label: '#E5A155', btnBorder: '#E5A155', btnText: '#E5A155' },
  MISSING_CONTEXT:            { border: '#5B8DBE', label: '#5B8DBE', btnBorder: '#5B8DBE', btnText: '#5B8DBE' },
}

const typeLabel: Record<Issue['type'], string> = {
  SOURCE_VERIFICATION_NEEDED: 'Source verification needed',
  EVIDENCE_OVERREACH: 'Evidence overreach',
  MISSING_CONTEXT: 'Missing context',
}

export default function IssueCard({ issue }: Props) {
  const s = typeStyles[issue.type]
  return (
    <div
      className="rounded-xl bg-[#25262C] border border-[#353641] overflow-hidden"
      style={{ borderLeft: `3px solid ${s.border}` }}
    >
      <div className="px-4 py-4">
        <p
          className="text-[11px] font-medium uppercase tracking-wide mb-1.5"
          style={{ color: s.label }}
        >
          {typeLabel[issue.type]}
        </p>
        <p className="text-[15px] font-semibold text-[#ECECF1] mb-2 leading-snug">{issue.title}</p>
        <p className="text-[14px] text-[#B4B4B4] leading-relaxed mb-4">{issue.explanation}</p>
        <button
          className="text-[13px] px-4 py-2 rounded-lg border transition-colors duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#25262C]"
          style={{ borderColor: s.btnBorder, color: s.btnText }}
          aria-label={issue.action_label}
          onClick={() => {}}
        >
          {issue.action_label}
        </button>
      </div>
    </div>
  )
}
