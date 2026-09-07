import { useState, useRef, useEffect } from 'react'
import { Preset } from '../data/presets'
import { useBackboneStream } from '../hooks/useBackboneStream'
import UserMessage from './UserMessage'
import BackboneResponse from './BackboneResponse'
import PresetPrompts from './PresetPrompts'
import InputBar from './InputBar'
import LoadingDots from './LoadingDots'

export default function ChatArea() {
  const [activePreset, setActivePreset] = useState<Preset | null>(null)
  const [activeFreeText, setActiveFreeText] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)
  const { state, trigger, replay, reset } = useBackboneStream()
  const bottomRef = useRef<HTMLDivElement>(null)

  const hasActiveConversation = activePreset !== null || activeFreeText !== null
  const isLoading = state.stage === 0 && hasActiveConversation && !state.error
  const hasResponse = state.stage >= 1
  const isBusy = hasActiveConversation && state.stage < 6 && !state.error
  const inputDisabled = isBusy || cooldown > 0

  useEffect(() => {
    if (state.stage !== 6) return
    setCooldown(5)
    const interval = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) { clearInterval(interval); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [state.stage])

  const handleSelect = (preset: Preset) => {
    reset()
    setActivePreset(preset)
    setActiveFreeText(null)
    trigger(preset.id, preset.prompt)
  }

  const handleFreeForm = (text: string) => {
    reset()
    setActivePreset(null)
    setActiveFreeText(text)
    const id = `freeform:${text.trim().slice(0, 200)}`
    trigger(id, text, true)
  }

  const handleReplay = () => {
    if (activePreset) {
      const usedCache = replay(activePreset.id)
      if (!usedCache) trigger(activePreset.id, activePreset.prompt)
    } else if (activeFreeText) {
      const id = `freeform:${activeFreeText.trim().slice(0, 200)}`
      const usedCache = replay(id)
      if (!usedCache) trigger(id, activeFreeText)
    }
  }

  useEffect(() => {
    if (hasResponse) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [hasResponse, state.main_answer])

  const userText = activePreset?.prompt ?? activeFreeText ?? ''

  /* ─── Empty state: greeting + centered composer + suggestion chips ─── */
  if (!hasActiveConversation) {
    return (
      <div className="flex flex-col flex-1 overflow-y-auto scroll-thin">
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20 min-h-0">
          <h1 className="text-[28px] leading-tight font-medium text-text-primary text-center">
            How can I help?
          </h1>

          <div className="w-full max-w-[768px] mt-7">
            <InputBar
              onSubmit={handleFreeForm}
              disabled={inputDisabled}
              cooldownSeconds={cooldown}
              showCaption={false}
            />

            {/* No preset can be active in the empty state — selecting one
                immediately switches to the conversation view. */}
            <PresetPrompts onSelect={handleSelect} disabled={inputDisabled} />
          </div>

          <p className="text-[12px] text-text-muted text-center max-w-[600px] mt-8 leading-relaxed">
            Backbone applies its calibration framework to any input, but response quality and depth
            vary by prompt complexity — reflecting the underlying open-source LLM (Groq) rather than
            Backbone's design.
          </p>
        </div>
      </div>
    )
  }

  /* ─── Conversation: scrolling transcript + bottom-docked composer ─── */
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto scroll-thin">
        <div className="max-w-[768px] mx-auto px-4 pt-4 pb-4">
          <UserMessage text={userText} />

          {isLoading && <LoadingDots />}

          {(hasResponse || state.error) && (
            <BackboneResponse
              state={state}
              onReplay={handleReplay}
            />
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="flex-shrink-0 bg-bg-primary px-4 pb-4">
        <div className="max-w-[768px] mx-auto">
          <InputBar
            onSubmit={handleFreeForm}
            disabled={inputDisabled}
            cooldownSeconds={cooldown}
          />
        </div>
      </div>
    </div>
  )
}
