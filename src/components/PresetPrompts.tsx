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
    <div className="max-w-[768px] mx-auto px-4 pb-3">
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => {
          const Icon = iconMap[preset.icon] ?? BookOpen
          const isActive = activeId === preset.id
          const showSpinner = isLoading && isActive
          return (
            <button
              key={preset.id}
              onClick={() => !disabled && onSelect(preset)}
              disabled={disabled}
              aria-label={preset.label}
              aria-busy={showSpinner}
              className={`
                flex items-start gap-3 px-4 py-3 rounded-xl border text-left
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#10A37F80]
                ${disabled
                  ? 'border-[#2D2D3A] opacity-50 cursor-not-allowed'
                  : isActive
                    ? 'border-[#10A37F] bg-[#10A37F15] cursor-pointer'
                    : 'border-[#353641] hover:border-[#10A37F60] hover:bg-[#2A2B32] hover:-translate-y-0.5 cursor-pointer'
                }
              `}
            >
              <div className="mt-0.5 flex-shrink-0">
                {showSpinner ? (
                  <Loader2 size={16} className="text-[#10A37F] animate-spin" />
                ) : (
                  <Icon size={16} className="text-[#10A37F]" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-[#ECECF1] font-medium leading-snug">{preset.label}</p>
                <p className="text-xs text-[#8A8A8A] mt-0.5">Try this</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
