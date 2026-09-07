import { useState, useRef, useCallback } from 'react'
import { Plus, Brain, Mic, AudioLines, ArrowUp } from 'lucide-react'

interface Props {
  onSubmit: (text: string) => void
  disabled?: boolean
  cooldownSeconds?: number
  showCaption?: boolean
}

export default function InputBar({
  onSubmit,
  disabled = false,
  cooldownSeconds = 0,
  showCaption = true,
}: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [])

  const submit = useCallback(() => {
    const text = value.trim()
    if (!text || disabled) return
    onSubmit(text)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }, [value, disabled, onSubmit])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const canSend = value.trim().length > 0 && !disabled

  return (
    <div className="w-full">
      <div
        className={`rounded-composer bg-bg-composer transition-opacity duration-200 ${
          disabled ? 'opacity-60' : ''
        }`}
      >
        <div className="flex items-center gap-1 pl-2.5 pr-2.5 py-2.5 min-h-[52px]">
          <button
            aria-label="Add attachment"
            disabled
            className="p-2 rounded-full text-text-secondary cursor-not-allowed flex-shrink-0"
          >
            <Plus size={20} />
          </button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => { setValue(e.target.value); adjustHeight() }}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Ask anything"
            rows={1}
            className={`flex-1 bg-transparent text-[16px] leading-6 resize-none outline-none px-1 py-0 min-h-[24px] max-h-[200px] overflow-y-auto scroll-thin placeholder-text-muted ${
              disabled ? 'text-text-muted cursor-not-allowed' : 'text-text-primary'
            }`}
          />

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              aria-label="Think longer"
              disabled
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[15px] text-text-secondary cursor-not-allowed"
            >
              <Brain size={18} />
              <span>Think</span>
            </button>

            <button
              aria-label="Dictate"
              disabled
              className="p-2 rounded-full text-text-secondary cursor-not-allowed"
            >
              <Mic size={18} />
            </button>

            <button
              aria-label={canSend ? 'Send message' : 'Voice mode'}
              onClick={submit}
              disabled={!canSend}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                canSend
                  ? 'bg-[#EDEDED] text-[#0D0D0D] hover:bg-white cursor-pointer'
                  : 'bg-accent-blue text-white cursor-not-allowed'
              }`}
            >
              {canSend ? <ArrowUp size={18} /> : <AudioLines size={18} />}
            </button>
          </div>
        </div>
      </div>

      {showCaption && (
        <p className="text-center text-[12px] text-text-muted mt-2">
          {cooldownSeconds > 0
            ? `Please wait... ${cooldownSeconds}s`
            : 'ChatGPT can make mistakes. Check important info.'}
        </p>
      )}
    </div>
  )
}
