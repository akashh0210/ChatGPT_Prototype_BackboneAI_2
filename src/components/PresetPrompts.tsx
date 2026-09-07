import { BookOpen, Cpu, Scale, Target, Loader2 } from 'lucide-react'
import { presets, Preset } from '../data/presets'

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Cpu,
  Scale,
  Target,
}

interface Props {
  onSelect: (preset: Preset) => void
  disabled?: boolean
  activeId?: string
  isLoading?: boolean
}

export default function PresetPrompts({ onSelect, disabled, activeId, isLoading }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
      {presets.map((preset) => {
        const Icon = iconMap[preset.icon] ?? BookOpen
        const isActive = activeId === preset.id
        const showSpinner = isLoading && isActive
        return (
          <button
            key={preset.id}
            onClick={() => !disabled && onSelect(preset)}
            disabled={disabled}
            title={preset.label}
            aria-label={preset.label}
            aria-busy={showSpinner}
            className={`
              flex items-center gap-2 px-4 h-9 rounded-full border text-[14px]
              transition-colors duration-150
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30
              ${disabled
                ? 'border-border-subtle text-text-muted opacity-50 cursor-not-allowed'
                : 'border-border-strong text-text-secondary hover:bg-bg-hover hover:text-text-primary cursor-pointer'
              }
            `}
          >
            {showSpinner ? (
              <Loader2 size={15} className="flex-shrink-0 animate-spin" />
            ) : (
              <Icon size={15} className="flex-shrink-0" />
            )}
            <span className="whitespace-nowrap">{preset.short}</span>
          </button>
        )
      })}
    </div>
  )
}
