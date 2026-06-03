import { useState, useCallback, useRef } from 'react'
import type { StreamState, StreamStage, BackboneResponseData, ConfidenceMarker, Issue } from '../types/backbone'
import { fallbackResponses } from '../data/fallbackResponses'

const initialState: StreamState = {
  stage: 0,
  reasoning_steps: [],
  main_answer: '',
  assumptions: [],
  confidence_markers: [],
  issues: [],
  error: null,
}

function toStage(n: number): StreamStage {
  return Math.min(6, Math.max(0, n)) as StreamStage
}

export function useBackboneStream() {
  const [state, setState] = useState<StreamState>(initialState)
  const cacheRef = useRef<Map<string, BackboneResponseData>>(new Map())
  const abortRef = useRef<AbortController | null>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const cancelTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  const replayFromCache = useCallback((data: BackboneResponseData) => {
    cancelTimers()
    setState({ ...initialState })

    const words = data.main_answer.split(' ')
    const wordDuration = words.length * 18 // ~18ms per word replay

    timersRef.current.push(
      setTimeout(() =>
        setState(s => ({ ...s, stage: 1, reasoning_steps: data.reasoning_steps })), 80),

      ...words.map((_word, i) =>
        setTimeout(() => {
          const fragment = words.slice(0, i + 1).join(' ')
          setState(s => ({ ...s, stage: toStage(Math.max(s.stage, 2)), main_answer: fragment }))
        }, 180 + i * 18)
      ),

      setTimeout(() =>
        setState(s => ({ ...s, assumptions: data.assumptions, stage: 3, confidence_markers: data.confidence_markers })),
        180 + wordDuration + 100),

      setTimeout(() =>
        setState(s => ({ ...s, stage: 4 })),
        180 + wordDuration + 700),

      setTimeout(() =>
        setState(s => ({ ...s, stage: 5, issues: data.issues })),
        180 + wordDuration + 1100),

      setTimeout(() =>
        setState(s => ({ ...s, stage: 6 })),
        180 + wordDuration + 1300),
    )
  }, [cancelTimers])

  const trigger = useCallback(async (promptId: string, promptText: string, isFreeForm = false) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    cancelTimers()
    setState({ ...initialState })

    // Use cached response if available
    const cached = cacheRef.current.get(promptId)
    if (cached) {
      replayFromCache(cached)
      return
    }

    try {
      const res = await fetch('/api/backbone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId, promptText, isFreeForm }),
        signal: controller.signal,
      })

      if (!res.ok || !res.body) {
        const fb = fallbackResponses[promptId]
        if (fb) { setState({ ...fb, stage: 6, error: null }); return }
        setState(s => ({ ...s, error: `Server error ${res.status}` }))
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      // Local accumulation for cache
      let storedSteps: string[] = []
      let storedAnswer = ''
      let storedAssumptions: string[] = []
      let storedMarkers: ConfidenceMarker[] = []
      let storedIssues: Issue[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split('\n\n')
        buffer = parts.pop() ?? ''

        for (const part of parts) {
          const line = part.trim()
          if (!line.startsWith('data: ')) continue

          let event: { type: string; data?: unknown }
          try { event = JSON.parse(line.slice(6)) } catch { continue }

          switch (event.type) {
            case 'reasoning_steps':
              storedSteps = event.data as string[]
              setState(s => ({ ...s, stage: 1, reasoning_steps: storedSteps }))
              break

            case 'main_answer_word':
              storedAnswer += event.data as string
              setState(s => ({
                ...s,
                stage: toStage(Math.max(s.stage, 2)),
                main_answer: s.main_answer + (event.data as string),
              }))
              break

            case 'assumptions':
              storedAssumptions = event.data as string[]
              setState(s => ({ ...s, assumptions: storedAssumptions }))
              break

            case 'confidence_markers':
              storedMarkers = event.data as ConfidenceMarker[]
              setState(s => ({ ...s, stage: 3, confidence_markers: storedMarkers }))
              // Stagger stages 4, 5, and 6 so AssumptionsBlock and SelfCritiqueFooter
              // animate in sequentially rather than mounting at the same time as done fires.
              timersRef.current.push(
                setTimeout(() => setState(s => ({ ...s, stage: toStage(Math.max(s.stage, 4)) })), 600),
                setTimeout(() => setState(s => ({ ...s, stage: toStage(Math.max(s.stage, 5)) })), 1000),
                setTimeout(() => setState(s => ({ ...s, stage: 6 })), 1200),
              )
              break

            case 'issues':
              storedIssues = event.data as Issue[]
              setState(s => ({ ...s, issues: storedIssues }))
              break

            case 'done':
              cacheRef.current.set(promptId, {
                reasoning_steps: storedSteps,
                main_answer: storedAnswer,
                assumptions: storedAssumptions,
                confidence_markers: storedMarkers,
                issues: storedIssues,
              })
              // Stage 6 is driven by the timer above; done only commits the cache.
              break

            case 'error': {
              const fb = fallbackResponses[promptId]
              if (fb) { setState({ ...fb, stage: 6, error: null }) }
              else { setState(s => ({ ...s, error: event.data as string })) }
              break
            }
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      const fb = fallbackResponses[promptId]
      if (fb) { setState({ ...fb, stage: 6, error: null }) }
      else { setState(s => ({ ...s, error: (err as Error).message })) }
    }
  }, [replayFromCache, cancelTimers])

  const replay = useCallback((promptId: string): boolean => {
    const cached = cacheRef.current.get(promptId)
    if (!cached) return false
    abortRef.current?.abort()
    replayFromCache(cached)
    return true
  }, [replayFromCache])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    cancelTimers()
    setState({ ...initialState })
  }, [cancelTimers])

  return { state, trigger, replay, reset }
}
