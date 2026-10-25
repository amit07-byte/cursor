import type { LearningPathForm, PathVideoType } from '../../src/types/learningPath'
import { HttpError, MAX_MODULES, isPathVideoType } from './validate'

export interface CurriculumModule {
  title: string
  week: number
  type: PathVideoType
  reason: string
  searchQuery: string
}

export interface CurriculumPlan {
  title: string
  summary: string
  weeks: number
  hoursPerWeek: string
  modules: CurriculumModule[]
}

export const CURRICULUM_JSON_SCHEMA_HINT =
  '{"title":string,"summary":string,"weeks":number,"hoursPerWeek":string,"modules":[{"title":string,"week":number,"type":"core"|"practice"|"project"|"deep-dive","reason":string,"searchQuery":string}]}'

export const CURRICULUM_SYSTEM_INSTRUCTION = `You are Pathly, an expert curriculum designer. Reply with JSON only matching: ${CURRICULUM_JSON_SCHEMA_HINT}`

export function buildCurriculumPrompt(form: LearningPathForm): string {
  return [
    'Create a sequential YouTube learning curriculum as JSON.',
    'The learner form data:',
    JSON.stringify(
      {
        topic: form.topic,
        skillLevel: form.skillLevel,
        learningGoal: form.learningGoal || null,
        timePerWeek: form.timePerWeek || null,
        timeline: form.timeline || null,
        videoLengths: form.videoLengths,
        teachingStyles: form.teachingStyles,
        creatorPreferences: form.creatorPreferences,
        excludeFilters: form.excludeFilters,
        includeFilters: form.includeFilters,
        maxVideoAgeYears: form.maxVideoAgeYears,
        preferredLanguage: form.preferredLanguage,
      },
      null,
      2,
    ),
    '',
    'Requirements:',
    `- Return 4 to ${MAX_MODULES} modules in a logical beginner-to-goal order.`,
    '- Each module is one major step (e.g. fundamentals → control flow → functions → OOP → APIs → project).',
    '- searchQuery must be a concise YouTube search string for educational videos for that step.',
    '- Prefer tutorial/lecture/course content; avoid clickbait phrasing in searchQuery.',
    '- weeks should match the timeline when provided; otherwise estimate reasonably.',
    '- hoursPerWeek should echo the form value when provided, else a sensible default string.',
    '- type must be one of: core, practice, project, deep-dive.',
    '- Do not invent video IDs, titles, channels, or URLs. Only describe curriculum modules.',
  ].join('\n')
}

/** Strip optional markdown fences before JSON.parse. */
export function extractJsonText(raw: string): string {
  const trimmed = raw.trim()
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  return fenced ? fenced[1].trim() : trimmed
}

export function parseCurriculumJson(
  content: string,
  form: LearningPathForm,
): CurriculumPlan {
  if (!content.trim()) {
    throw new HttpError(502, 'Curriculum provider returned an empty curriculum.')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(extractJsonText(content))
  } catch {
    throw new HttpError(502, 'Curriculum provider returned non-JSON curriculum data.')
  }

  return normalizeCurriculum(parsed, form)
}

export function normalizeCurriculum(
  raw: unknown,
  form: LearningPathForm,
): CurriculumPlan {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new HttpError(502, 'Curriculum response was invalid.')
  }

  const data = raw as Record<string, unknown>
  const modulesRaw = Array.isArray(data.modules) ? data.modules : []
  if (modulesRaw.length === 0) {
    throw new HttpError(502, 'Curriculum response had no modules.')
  }

  const modules: CurriculumModule[] = modulesRaw
    .slice(0, MAX_MODULES)
    .map((item, index) => {
      const mod = item && typeof item === 'object' ? (item as Record<string, unknown>) : {}
      const title =
        typeof mod.title === 'string' && mod.title.trim()
          ? mod.title.trim().slice(0, 160)
          : `Step ${index + 1}`
      const searchQuery =
        typeof mod.searchQuery === 'string' && mod.searchQuery.trim()
          ? mod.searchQuery.trim().slice(0, 200)
          : `${form.topic} ${title} tutorial`
      const reason =
        typeof mod.reason === 'string' && mod.reason.trim()
          ? mod.reason.trim().slice(0, 280)
          : `Builds toward ${form.learningGoal || form.topic}.`
      const week =
        typeof mod.week === 'number' && Number.isFinite(mod.week)
          ? Math.max(1, Math.min(24, Math.round(mod.week)))
          : Math.floor(index / 2) + 1
      const type: PathVideoType = isPathVideoType(mod.type) ? mod.type : 'core'

      return { title, week, type, reason, searchQuery }
    })

  const weeks =
    typeof data.weeks === 'number' && Number.isFinite(data.weeks)
      ? Math.max(1, Math.min(24, Math.round(data.weeks)))
      : Math.max(...modules.map((m) => m.week))

  return {
    title:
      typeof data.title === 'string' && data.title.trim()
        ? data.title.trim().slice(0, 120)
        : `Your ${form.topic} path`,
    summary:
      typeof data.summary === 'string' && data.summary.trim()
        ? data.summary.trim().slice(0, 500)
        : `A sequenced path for ${form.skillLevel || 'your level'} learning ${form.topic}.`,
    weeks,
    hoursPerWeek:
      typeof data.hoursPerWeek === 'string' && data.hoursPerWeek.trim()
        ? data.hoursPerWeek.trim().slice(0, 40)
        : form.timePerWeek || 'Flexible',
    modules,
  }
}
