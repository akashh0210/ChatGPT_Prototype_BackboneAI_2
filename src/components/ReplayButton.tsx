import { RotateCcw } from 'lucide-react'

interface Props {
  onReplay: () => void
}

export default function ReplayButton({ onReplay }: Props) {
  return (
    <button
      onClick={onReplay}
      aria-label="Replay response"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] text-[#8A8A8A] border border-[#353641]
                 hover:text-[#ECECF1] hover:border-[#10A37F60] hover:bg-[#2A2B32]
                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#10A37F80]
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
