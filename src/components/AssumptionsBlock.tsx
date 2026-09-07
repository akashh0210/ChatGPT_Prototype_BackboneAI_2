import { Pencil } from 'lucide-react'

interface Props {
  assumptions: string[]
}

export default function AssumptionsBlock({ assumptions }: Props) {
  return (
    <div
      className="animate-fade-slide-up rounded-xl border border-white/10 px-4 py-4 mb-5"
      style={{ background: 'linear-gradient(to bottom, #2A2A2A, #252525)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-[#10A37F] flex-shrink-0" />
        <p className="text-[13px] font-medium text-[#10A37F]">Assumptions I made:</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {assumptions.map((assumption, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-[13px] text-[#AFAFAF]"
          >
            <span>{assumption}</span>
            <button
              aria-label={`Edit assumption: ${assumption}`}
              className="text-[#8F8F8F] hover:text-[#ECECEC] transition-colors duration-150 focus:outline-none"
              onClick={() => {}}
            >
              <Pencil size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
