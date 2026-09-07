import { Sparkles, CircleDashed } from 'lucide-react'

export default function Header() {
  return (
    <header className="flex items-center justify-end h-[52px] px-4 bg-bg-primary flex-shrink-0">
      <div className="flex items-center gap-1">
        <button
          aria-label="Upgrade plan"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[15px] font-medium text-accent-blue-text hover:bg-bg-hover transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          <Sparkles size={16} />
          <span>Upgrade</span>
        </button>
        <button
          aria-label="Account"
          className="p-1.5 rounded-lg text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          <CircleDashed size={22} />
        </button>
      </div>
    </header>
  )
}
