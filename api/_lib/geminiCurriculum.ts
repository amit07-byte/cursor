import { GoogleGenAI } from '@google/genai'
import type { LearningPathForm } from '../../src/types/learningPath'
import {
  CURRICULUM_SYSTEM_INSTRUCTION,
  type CurriculumPlan,
  buildCurriculumPrompt,
  parseCurriculumJson,
} from './curriculum'
import { HttpError } from './validate'

/** Stable free-tier friendly Gemini Flash model. */
export const GEMINI_CURRICULUM_MODEL = 'gemini-2.0-flash'

export async function generateCurriculum(
  form: LearningPathForm,
  signal?: AbortSignal,
): Promise<CurriculumPlan> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new HttpError(500, 'Gemini is not configured on the server.')
  }

  const ai = new GoogleGenAI({ apiKey })

  let content = ''
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_CURRICULUM_MODEL,
      contents: buildCurriculumPrompt(form),
      config: {
        temperature: 0.4,
        responseMimeType: 'application/json',
        systemInstruction: CURRICULUM_SYSTEM_INSTRUCTION,
        abortSignal: signal,
      },
    })
    content = typeof response.text === 'string' ? response.text : ''
  } catch (error) {
    if (signal?.aborted) {
      throw new Error('Gemini request failed: aborted')
    }
    const detail =
      error instanceof Error
        ? error.message
        : typeof error === 'object' && error && 'message' in error
          ? String((error as { message: unknown }).message)
          : 'unknown error'
    const status =
      typeof error === 'object' && error && 'status' in error
        ? String((error as { status: unknown }).status)
        : typeof error === 'object' &&
            error &&
            'statusCode' in error
          ? String((error as { statusCode: unknown }).statusCode)
          : ''
    const code =
      typeof error === 'object' && error && 'code' in error
        ? String((error as { code: unknown }).code)
        : ''
    throw new Error(
      `Gemini request failed${status ? ` (${status})` : ''}${code ? ` [${code}]` : ''}: ${detail}`,
    )
  }

  return parseCurriculumJson(content, form)
}
