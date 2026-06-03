import { useState, useRef, useCallback } from 'react'
import { Paperclip, Mic, ArrowUp } from 'lucide-react'

interface Props {
  onSubmit: (text: string) => void
  disabled?: boolean
  cooldownSeconds?: number
}

export default function InputBar({ onSubmit, disabled = false, cooldownSeconds = 0 }: Props) {
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
    <div className="px-4 pb-4">
      <div className="max-w-[768px] mx-auto">
        <div
          className={`relative rounded-2xl border bg-[#2F2F3A] transition-colors duration-200 ${
            disabled ? 'border-[#2D2D3A] opacity-60' : 'border-[#353641]'
          }`}
        >
          <div className="flex items-end gap-2 px-4 py-3">
            <button
              aria-label="Attach file"
              disabled
              className="p-1.5 text-[#8A8A8A] cursor-not-allowed flex-shrink-0 mb-0.5"
            >
              <Paperclip size={18} />
            </button>

            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => { setValue(e.target.value); adjustHeight() }}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder="Message ChatGPT..."
              rows={1}
              className={`flex-1 bg-transparent text-[15px] leading-relaxed resize-none outline-none py-0.5 min-h-[24px] max-h-[200px] overflow-y-auto ${
                disabled
                  ? 'text-[#8A8A8A] cursor-not-allowed placeholder-[#8A8A8A]'
                  : 'text-[#ECECF1] placeholder-[#8A8A8A]'
              }`}
            />

            <div className="flex items-center gap-1.5 flex-shrink-0 mb-0.5">
              <button
                aria-label="Voice input"
                disabled
                className="p-1.5 text-[#8A8A8A] cursor-not-allowed"
              >
                <Mic size={18} />
              </button>
              <button
                aria-label="Send message"
                onClick={submit}
                disabled={!canSend}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#10A37F80] ${
                  canSend
                    ? 'bg-[#ECECF1] text-[#212121] hover:bg-white cursor-pointer'
                    : 'border border-[#353641] text-[#8A8A8A] cursor-not-allowed'
                }`}
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#8A8A8A] mt-2">
          {cooldownSeconds > 0
            ? `Please wait... ${cooldownSeconds}s`
            : 'ChatGPT can make mistakes. Check important info.'}
        </p>
      </div>
    </div>
  )
}
