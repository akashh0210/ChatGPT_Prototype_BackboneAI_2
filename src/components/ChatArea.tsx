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

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[768px] mx-auto px-4 pt-8 pb-4">
          {!hasActiveConversation ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
              <p className="text-[#8A8A8A] text-[15px] text-center">
                Click a prompt below to see Backbone in action
              </p>
              <p className="text-[12px] text-[#8A8A8A] italic text-center max-w-[600px]">
                You can also type your own prompt in the input bar below. Backbone applies its
                calibration framework to any input, but response quality and depth vary by prompt
                complexity — reflecting the underlying open-source LLM (Groq) rather than
                Backbone's design.
              </p>
            </div>
          ) : (
            <>
              <UserMessage text={userText} />

              {isLoading && <LoadingDots />}

              {(hasResponse || state.error) && (
                <BackboneResponse
                  state={state}
                  onReplay={handleReplay}
                />
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-[#2D2D3A] bg-[#212121] pt-3">
        <PresetPrompts
          onSelect={handleSelect}
          disabled={inputDisabled}
          activeId={activePreset?.id}
          isLoading={isBusy}
        />
        <InputBar
          onSubmit={handleFreeForm}
          disabled={inputDisabled}
          cooldownSeconds={cooldown}
        />
      </div>
    </div>
  )
}
