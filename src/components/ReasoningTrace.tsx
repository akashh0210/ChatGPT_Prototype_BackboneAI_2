import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Props {
  steps: string[]
}

export default function ReasoningTrace({ steps }: Props) {
  const [expanded, setExpanded] = useState(steps.length > 1)

  return (
    <div
      className="animate-fade-slide-up rounded-xl border border-white/10 mb-5 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #2A2A2A, #252525)' }}
    >
      <button
        className="w-full flex items-center justify-between px-4 py-3 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#10A37F80] group"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-label={expanded ? 'Hide reasoning' : 'Show reasoning'}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10A37F] flex-shrink-0" />
          <span className="text-[13px] font-medium text-[#10A37F]">
            {expanded ? 'Hide reasoning' : 'Show reasoning'}
          </span>
        </div>
        <ChevronDown
          size={15}
          className="text-[#8F8F8F] transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4">
            <ol className="space-y-2.5">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#10A37F20] border border-[#10A37F40] flex items-center justify-center text-[11px] font-medium text-[#10A37F] mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-[14px] text-[#AFAFAF] leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
