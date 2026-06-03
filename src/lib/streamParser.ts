export function parseStreamChunk(chunk: string): Partial<Record<string, unknown>> {
  try {
    return JSON.parse(chunk)
  } catch {
    return {}
  }
}
