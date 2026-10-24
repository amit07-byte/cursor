import { describe, expect, it } from 'vitest'
import type { LearningPathForm } from '../../src/types/learningPath'
import {
  extractJsonText,
  normalizeCurriculum,
  parseCurriculumJson,
} from './curriculum'
import { HttpError, parseAndValidateForm, publicErrorMessage } from './validate'

const baseForm: LearningPathForm = {
  topic: 'React',
  skillLevel: 'Complete Beginner',
  learningGoal: 'Build a personal website',
  videoLengths: ['Medium (15-45 min)'],
  teachingStyles: ['Project-based (build along)'],
  creatorPreferences: ['Professional instructors'],
  timePerWeek: '3-5 hours',
  timeline: '1 month',
  excludeFilters: [],
  includeFilters: ['Project tutorials'],
  maxVideoAgeYears: 3,
  preferredLanguage: 'English',
}

const validCurriculum = {
  title: 'Your React path',
  summary: 'A sequenced React path for beginners.',
  weeks: 4,
  hoursPerWeek: '3-5 hours',
  modules: [
    {
      title: 'React foundations',
      week: 1,
      type: 'core',
      reason: 'Start with the basics.',
      searchQuery: 'react foundations tutorial for beginners',
    },
    {
      title: 'Build a personal site',
      week: 4,
      type: 'project',
      reason: 'Apply what you learned.',
      searchQuery: 'react personal website project tutorial',
    },
  ],
}

describe('parseAndValidateForm', () => {
  it('accepts a valid learning path form', () => {
    const form = parseAndValidateForm(baseForm)
    expect(form.topic).toBe('React')
    expect(form.skillLevel).toBe('Complete Beginner')
  })

  it('rejects missing topic', () => {
    expect(() => parseAndValidateForm({ ...baseForm, topic: '' })).toThrow(HttpError)
    try {
      parseAndValidateForm({ ...baseForm, topic: '' })
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError)
      expect((error as HttpError).status).toBe(400)
    }
  })

  it('rejects missing skill level', () => {
    expect(() => parseAndValidateForm({ ...baseForm, skillLevel: '' })).toThrow(
      /skill level/i,
    )
  })
})

describe('normalizeCurriculum / parseCurriculumJson', () => {
  it('preserves a valid curriculum schema', () => {
    const plan = normalizeCurriculum(validCurriculum, baseForm)
    expect(plan.title).toBe('Your React path')
    expect(plan.weeks).toBe(4)
    expect(plan.hoursPerWeek).toBe('3-5 hours')
    expect(plan.modules).toHaveLength(2)
    expect(plan.modules[0]).toMatchObject({
      title: 'React foundations',
      week: 1,
      type: 'core',
      searchQuery: 'react foundations tutorial for beginners',
    })
  })

  it('fills defaults for missing module fields', () => {
    const plan = normalizeCurriculum(
      {
        modules: [{ title: 'Hooks' }],
      },
      baseForm,
    )
    expect(plan.title).toBe('Your React path')
    expect(plan.modules[0].type).toBe('core')
    expect(plan.modules[0].searchQuery).toContain('React')
    expect(plan.modules[0].week).toBe(1)
  })

  it('rejects invalid model output without modules', () => {
    expect(() => normalizeCurriculum({ title: 'x', modules: [] }, baseForm)).toThrow(
      /no modules/i,
    )
  })

  it('rejects non-object curriculum payloads', () => {
    expect(() => normalizeCurriculum(['not', 'an', 'object'], baseForm)).toThrow(
      /invalid/i,
    )
  })

  it('parses JSON wrapped in markdown fences', () => {
    const fenced = `\`\`\`json\n${JSON.stringify(validCurriculum)}\n\`\`\``
    const plan = parseCurriculumJson(fenced, baseForm)
    expect(plan.modules).toHaveLength(2)
  })

  it('rejects empty or non-JSON provider text', () => {
    expect(() => parseCurriculumJson('', baseForm)).toThrow(/empty/i)
    expect(() => parseCurriculumJson('not-json', baseForm)).toThrow(/non-JSON/i)
  })

  it('extractJsonText leaves plain JSON unchanged', () => {
    expect(extractJsonText('{"a":1}')).toBe('{"a":1}')
  })
})

describe('publicErrorMessage', () => {
  it('maps missing configuration HttpError', () => {
    const result = publicErrorMessage(
      new HttpError(
        500,
        'Path generation is not configured. Add GEMINI_API_KEY and YOUTUBE_API_KEY on the server.',
      ),
    )
    expect(result.status).toBe(500)
    expect(result.message).toContain('GEMINI_API_KEY')
  })

  it('maps Gemini provider failures without leaking internals', () => {
    const result = publicErrorMessage(
      new Error('Gemini request failed (429) [RESOURCE_EXHAUSTED]: quota exceeded'),
    )
    expect(result.status).toBe(502)
    expect(result.message.toLowerCase()).toContain('gemini')
    expect(result.message).not.toMatch(/AIza|sk-/i)
  })

  it('maps Gemini auth failures', () => {
    const result = publicErrorMessage(
      new Error('Gemini request failed (401): API key not valid'),
    )
    expect(result.status).toBe(502)
    expect(result.message).toContain('GEMINI_API_KEY')
  })

  it('maps YouTube failures', () => {
    const result = publicErrorMessage(new Error('YouTube search failed: 403'))
    expect(result.status).toBe(502)
    expect(result.message.toLowerCase()).toContain('youtube')
  })
})
