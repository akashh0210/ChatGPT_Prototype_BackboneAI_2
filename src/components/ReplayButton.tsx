import { RotateCcw } from 'lucide-react'

interface Props {
  onReplay: () => void
}

export default function ReplayButton({ onReplay }: Props) {
  return (
    <button
      onClick={onReplay}
      aria-label="Replay response"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] text-[#8F8F8F] border border-white/10
                 hover:text-[#ECECEC] hover:border-white/25 hover:bg-[#2F2F2F]
                 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30
                 group"
    >
      <RotateCcw
        size={13}
        className="transition-transform duration-300 group-hover:rotate-[-180deg]"
      />
      Replay
    </button>
  )
}
