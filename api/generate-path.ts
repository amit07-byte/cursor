import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { GeneratedPath } from '../src/types/learningPath'
import { generateCurriculum } from './_lib/openaiCurriculum'
import {
  HttpError,
  MAX_BODY_BYTES,
  REQUEST_TIMEOUT_MS,
  parseAndValidateForm,
  publicErrorMessage,
} from './_lib/validate'
import { findVideosForModules } from './_lib/youtubeSearch'

export const config = {
  maxDuration: 60,
}

function readRawBody(req: VercelRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let size = 0

    req.on('data', (chunk: Buffer | string) => {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
      size += buf.length
      if (size > MAX_BODY_BYTES) {
        reject(new HttpError(413, 'Request body is too large.'))
        req.destroy()
        return
      }
      chunks.push(buf)
    })

    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

async function parseBody(req: VercelRequest): Promise<unknown> {
  if (req.body && typeof req.body === 'object') {
    return req.body
  }

  if (typeof req.body === 'string' && req.body.trim()) {
    try {
      return JSON.parse(req.body)
    } catch {
      throw new HttpError(400, 'Request body must be valid JSON.')
    }
  }

  const raw = await readRawBody(req)
  if (!raw.trim()) {
    throw new HttpError(400, 'Request body is required.')
  }

  try {
    return JSON.parse(raw)
  } catch {
    throw new HttpError(400, 'Request body must be valid JSON.')
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method not allowed. Use POST.' })
    return
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const body = await parseBody(req)
    const form = parseAndValidateForm(body)

    if (!process.env.OPENAI_API_KEY || !process.env.YOUTUBE_API_KEY) {
      throw new HttpError(
        500,
        'Path generation is not configured. Add OPENAI_API_KEY and YOUTUBE_API_KEY on the server.',
      )
    }

    const curriculum = await generateCurriculum(form, controller.signal)
    const videos = await findVideosForModules(
      curriculum.modules,
      form,
      controller.signal,
    )

    const path: GeneratedPath = {
      title: curriculum.title,
      summary: curriculum.summary,
      weeks: curriculum.weeks,
      hoursPerWeek: curriculum.hoursPerWeek,
      videos,
      modules: curriculum.modules.map((module) => ({
        title: module.title,
        week: module.week,
        type: module.type,
      })),
    }

    res.status(200).json(path)
  } catch (error) {
    const { status, message } = publicErrorMessage(error)
    res.status(status).json({ error: message })
  } finally {
    clearTimeout(timeout)
  }
}
