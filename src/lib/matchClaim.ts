import { ConfidenceMarker } from '../types/backbone'

export interface TextSegment {
  text: string
  marker?: ConfidenceMarker
  markerIndex?: number
}

export function matchClaims(mainAnswer: string, markers: ConfidenceMarker[]): TextSegment[] {
  if (!markers.length) return [{ text: mainAnswer }]

  // Sort markers by their position in the text so we can slice left-to-right
  const positioned = markers
    .map((m) => ({ marker: m, idx: mainAnswer.indexOf(m.claim_substring) }))
    .filter((m) => {
      if (m.idx === -1) {
        console.warn(`[matchClaims] claim_substring not found in main_answer: "${m.marker.claim_substring.slice(0, 60)}"`)
        return false
      }
      return true
    })
    .sort((a, b) => a.idx - b.idx)

  const segments: TextSegment[] = []
  let cursor = 0
  let markerCount = 0

  for (const { marker, idx } of positioned) {
    if (idx < cursor) continue // skip overlapping markers
    if (idx > cursor) segments.push({ text: mainAnswer.slice(cursor, idx) })
    segments.push({ text: marker.claim_substring, marker, markerIndex: markerCount++ })
    cursor = idx + marker.claim_substring.length
  }

  if (cursor < mainAnswer.length) segments.push({ text: mainAnswer.slice(cursor) })
  return segments
}
