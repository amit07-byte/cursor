import type {
  GeneratePathErrorResponse,
  GeneratedPath,
  LearningPathForm,
} from '../types/learningPath'

const REQUEST_TIMEOUT_MS = 60_000

export async function requestLearningPath(
  form: LearningPathForm,
): Promise<GeneratedPath> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch('/api/generate-path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      signal: controller.signal,
    })

    const data = (await response.json().catch(() => null)) as
      | GeneratedPath
      | GeneratePathErrorResponse
      | null

    if (!response.ok) {
      const message =
        data && 'error' in data && typeof data.error === 'string'
          ? data.error
          : 'Could not generate your learning path. Please try again.'
      throw new Error(message)
    }

    if (
      !data ||
      !('videos' in data) ||
      !Array.isArray(data.videos) ||
      typeof data.title !== 'string'
    ) {
      throw new Error('Received an invalid learning path from the server.')
    }

    return data
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Path generation timed out. Please try again.')
    }
    if (error instanceof TypeError) {
      throw new Error(
        'Could not reach the Pathly API. If you are developing locally, run with `vercel dev` and set OPENAI_API_KEY and YOUTUBE_API_KEY.',
      )
    }
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}

export const GOAL_EXAMPLES = [
  'Build a personal website',
  'Have basic conversations in Spanish',
  'Produce electronic music',
] as const

export const VIDEO_LENGTH_OPTIONS = [
  { value: 'Short (5-15 min)', hint: 'quick concepts' },
  { value: 'Medium (15-45 min)', hint: 'standard tutorials' },
  { value: 'Long (45+ min)', hint: 'deep dives' },
  { value: 'Any length', hint: 'no preference' },
] as const

export const TEACHING_STYLE_OPTIONS = [
  'Straight to the point (no fluff)',
  'Detailed explanations',
  'Project-based (build along)',
  'Theory-focused',
  'Visual/animated',
  'Code-along / hands-on',
] as const

export const CREATOR_OPTIONS = [
  'Professional instructors',
  'Self-taught creators',
  'University lectures',
  'Any credible source',
] as const

export const EXCLUDE_OPTIONS = [
  'Videos over X years old',
  'Clickbait titles',
  'Low production quality',
  'Non-English',
] as const

export const INCLUDE_OPTIONS = [
  'Practice exercises/assignments',
  'Project tutorials',
  'Quizzes/assessments',
  'Downloadable resources',
] as const
