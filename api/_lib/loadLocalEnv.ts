import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Vercel production injects server env vars automatically.
 * For local `vercel dev` with Vite, `.env.local` is not always injected
 * into Node serverless functions — load it here as a fallback.
 * Existing process.env values are never overwritten.
 */
export function loadLocalEnv(): void {
  if (process.env.OPENAI_API_KEY && process.env.YOUTUBE_API_KEY) {
    return
  }

  for (const filename of ['.env.local', '.env']) {
    const filePath = resolve(process.cwd(), filename)
    if (!existsSync(filePath)) continue

    let contents = ''
    try {
      contents = readFileSync(filePath, 'utf8')
    } catch {
      continue
    }

    for (const rawLine of contents.split(/\r?\n/)) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue

      const cleaned = line.startsWith('export ')
        ? line.slice('export '.length).trim()
        : line
      const eq = cleaned.indexOf('=')
      if (eq <= 0) continue

      const key = cleaned.slice(0, eq).trim()
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue
      if (process.env[key] !== undefined) continue

      let value = cleaned.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      process.env[key] = value
    }
  }
}
