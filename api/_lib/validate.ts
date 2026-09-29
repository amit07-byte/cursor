import type { LearningPathForm, PathVideoType } from '../../src/types/learningPath'

export const MAX_BODY_BYTES = 24_000
export const MAX_TOPIC_LENGTH = 120
export const MAX_GOAL_LENGTH = 800
export const MAX_LANGUAGE_LENGTH = 60
export const MAX_ARRAY_ITEMS = 12
export const MAX_MODULES = 8
export const VIDEOS_PER_MODULE = 1
export const REQUEST_TIMEOUT_MS = 55_000

export class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = 'HttpError'
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function clampString(value: unknown, max: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

export function parseAndValidateForm(body: unknown): LearningPathForm {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(400, 'Request body must be a JSON object.')
  }

  const raw = body as Record<string, unknown>
  const topic = clampString(raw.topic, MAX_TOPIC_LENGTH)
  const skillLevel = clampString(raw.skillLevel, 80) as LearningPathForm['skillLevel']
  const learningGoal = clampString(raw.learningGoal, MAX_GOAL_LENGTH)

  if (!topic) {
    throw new HttpError(400, 'Topic is required.')
  }
  if (!skillLevel) {
    throw new HttpError(400, 'Current skill level is required.')
  }

  const videoLengths = isStringArray(raw.videoLengths)
    ? raw.videoLengths.slice(0, MAX_ARRAY_ITEMS)
    : []
  const teachingStyles = isStringArray(raw.teachingStyles)
    ? raw.teachingStyles.slice(0, MAX_ARRAY_ITEMS)
    : []
  const creatorPreferences = isStringArray(raw.creatorPreferences)
    ? raw.creatorPreferences.slice(0, MAX_ARRAY_ITEMS)
    : []
  const excludeFilters = isStringArray(raw.excludeFilters)
    ? raw.excludeFilters.slice(0, MAX_ARRAY_ITEMS)
    : []
  const includeFilters = isStringArray(raw.includeFilters)
    ? raw.includeFilters.slice(0, MAX_ARRAY_ITEMS)
    : []

  const maxVideoAgeYears =
    typeof raw.maxVideoAgeYears === 'number' && Number.isFinite(raw.maxVideoAgeYears)
      ? Math.min(20, Math.max(1, Math.round(raw.maxVideoAgeYears)))
      : 3

  return {
    topic,
    skillLevel,
    learningGoal,
    videoLengths: videoLengths as LearningPathForm['videoLengths'],
    teachingStyles: teachingStyles as LearningPathForm['teachingStyles'],
    creatorPreferences:
      creatorPreferences as LearningPathForm['creatorPreferences'],
    timePerWeek: clampString(raw.timePerWeek, 40) as LearningPathForm['timePerWeek'],
    timeline: clampString(raw.timeline, 40) as LearningPathForm['timeline'],
    excludeFilters: excludeFilters as LearningPathForm['excludeFilters'],
    includeFilters: includeFilters as LearningPathForm['includeFilters'],
    maxVideoAgeYears,
    preferredLanguage: clampString(raw.preferredLanguage, MAX_LANGUAGE_LENGTH) || 'English',
  }
}

export function isPathVideoType(value: unknown): value is PathVideoType {
  return (
    value === 'core' ||
    value === 'practice' ||
    value === 'project' ||
    value === 'deep-dive'
  )
}

export function formatDuration(isoDuration: string | undefined): string {
  if (!isoDuration) return '—'
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return '—'
  const hours = Number(match[1] || 0)
  const minutes = Number(match[2] || 0)
  const seconds = Number(match[3] || 0)
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function publicErrorMessage(error: unknown): { status: number; message: string } {
  if (error instanceof HttpError) {
    return { status: error.status, message: error.message }
  }

  const message = error instanceof Error ? error.message : ''
  const lower = message.toLowerCase()

  if (/timeout|aborted|aborterror/i.test(message)) {
    return {
      status: 504,
      message: 'Path generation timed out. Please try again.',
    }
  }

  // OpenAI billing / rate limits — keep guidance actionable without leaking internals
  if (
    /insufficient_quota|credit_balance_exhausted|no credits remaining|exceeded your current quota/i.test(
      message,
    )
  ) {
    return {
      status: 502,
      message:
        'OpenAI reports no API credits remaining. Add credits in your OpenAI billing settings, then try again.',
    }
  }

  if (/openai.*\b401\b|\binvalid api key\b|incorrect api key/i.test(lower)) {
    return {
      status: 502,
      message:
        'OpenAI rejected the API key. Check OPENAI_API_KEY on the server, then try again.',
    }
  }

  if (/rate limit|429/.test(lower) && /openai/i.test(message)) {
    return {
      status: 429,
      message: 'OpenAI rate limit reached. Please wait a moment and try again.',
    }
  }

  if (/openai|OPENAI/i.test(message)) {
    return {
      status: 502,
      message: 'Could not generate a curriculum right now. Please try again shortly.',
    }
  }

  if (/youtube|YOUTUBE|quota/i.test(message)) {
    return {
      status: 502,
      message: 'Could not find YouTube resources right now. Please try again shortly.',
    }
  }

  return {
    status: 500,
    message: 'Something went wrong while generating your learning path.',
  }
}
