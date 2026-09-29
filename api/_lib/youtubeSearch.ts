import type { LearningPathForm, PathVideo } from '../../src/types/learningPath'
import type { CurriculumModule } from './openaiCurriculum'
import {
  HttpError,
  VIDEOS_PER_MODULE,
  formatDuration,
} from './validate'

interface YouTubeSearchItem {
  id?: { videoId?: string }
  snippet?: {
    title?: string
    channelTitle?: string
    description?: string
    publishedAt?: string
    thumbnails?: {
      medium?: { url?: string }
      high?: { url?: string }
      default?: { url?: string }
    }
  }
}

interface YouTubeVideoItem {
  id?: string
  contentDetails?: { duration?: string }
  snippet?: {
    title?: string
    channelTitle?: string
    description?: string
    thumbnails?: {
      medium?: { url?: string }
      high?: { url?: string }
      default?: { url?: string }
    }
  }
  statistics?: {
    viewCount?: string
    likeCount?: string
  }
}

function languageCode(preferredLanguage: string): string | undefined {
  const lang = preferredLanguage.trim().toLowerCase()
  if (!lang || lang === 'english') return 'en'
  if (lang === 'spanish' || lang === 'español' || lang === 'espanol') return 'es'
  if (lang === 'french' || lang === 'français' || lang === 'francais') return 'fr'
  if (lang === 'german' || lang === 'deutsch') return 'de'
  if (lang === 'portuguese' || lang === 'português' || lang === 'portugues') return 'pt'
  if (lang === 'hindi') return 'hi'
  if (lang.length === 2) return lang
  return undefined
}

function buildSearchQuery(module: CurriculumModule, form: LearningPathForm): string {
  const parts = [module.searchQuery]
  if (form.teachingStyles.includes('Straight to the point (no fluff)')) {
    parts.push('concise')
  }
  if (form.teachingStyles.includes('Project-based (build along)')) {
    parts.push('project tutorial')
  }
  if (form.creatorPreferences.includes('University lectures')) {
    parts.push('lecture')
  }
  if (form.includeFilters.includes('Project tutorials') && module.type === 'project') {
    parts.push('full project')
  }
  return parts.join(' ').trim()
}

function publishedAfter(form: LearningPathForm): string | undefined {
  if (!form.excludeFilters.includes('Videos over X years old')) return undefined
  const years = form.maxVideoAgeYears || 3
  const date = new Date()
  date.setFullYear(date.getFullYear() - years)
  return date.toISOString()
}

function looksLikeClickbait(title: string): boolean {
  return /(gone wrong|you won't believe|shocking|click here|\b\d+\s*things\b|must watch!!!)/i.test(
    title,
  )
}

async function youtubeGet<T>(
  path: string,
  params: Record<string, string>,
  apiKey: string,
  signal?: AbortSignal,
): Promise<T> {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  url.searchParams.set('key', apiKey)

  const response = await fetch(url, { signal })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`YouTube API ${path} failed (${response.status}): ${text.slice(0, 200)}`)
  }
  return (await response.json()) as T
}

async function searchVideosForModule(
  module: CurriculumModule,
  form: LearningPathForm,
  apiKey: string,
  signal?: AbortSignal,
): Promise<YouTubeSearchItem[]> {
  const params: Record<string, string> = {
    part: 'snippet',
    type: 'video',
    maxResults: '5',
    q: buildSearchQuery(module, form),
    safeSearch: 'moderate',
    relevanceLanguage:
      form.excludeFilters.includes('Non-English')
        ? languageCode(form.preferredLanguage) || 'en'
        : languageCode(form.preferredLanguage) || 'en',
    videoEmbeddable: 'true',
  }

  const after = publishedAfter(form)
  if (after) params.publishedAfter = after

  if (form.videoLengths.includes('Short (5-15 min)') && form.videoLengths.length === 1) {
    params.videoDuration = 'medium'
  } else if (form.videoLengths.includes('Long (45+ min)') && form.videoLengths.length === 1) {
    params.videoDuration = 'long'
  } else if (form.videoLengths.includes('Medium (15-45 min)') && form.videoLengths.length === 1) {
    params.videoDuration = 'medium'
  }

  const data = await youtubeGet<{ items?: YouTubeSearchItem[] }>(
    'search',
    params,
    apiKey,
    signal,
  )

  const items = data.items || []
  if (form.excludeFilters.includes('Clickbait titles')) {
    return items.filter((item) => !looksLikeClickbait(item.snippet?.title || ''))
  }
  return items
}

async function hydrateVideoDetails(
  videoIds: string[],
  apiKey: string,
  signal?: AbortSignal,
): Promise<Map<string, YouTubeVideoItem>> {
  const map = new Map<string, YouTubeVideoItem>()
  if (videoIds.length === 0) return map

  const data = await youtubeGet<{ items?: YouTubeVideoItem[] }>(
    'videos',
    {
      part: 'contentDetails,snippet,statistics',
      id: videoIds.join(','),
      maxResults: String(videoIds.length),
    },
    apiKey,
    signal,
  )

  for (const item of data.items || []) {
    if (item.id) map.set(item.id, item)
  }
  return map
}

function pickThumbnail(item: YouTubeSearchItem | YouTubeVideoItem): string | undefined {
  const thumbs = item.snippet?.thumbnails
  return thumbs?.medium?.url || thumbs?.high?.url || thumbs?.default?.url
}

export async function findVideosForModules(
  modules: CurriculumModule[],
  form: LearningPathForm,
  signal?: AbortSignal,
): Promise<PathVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    throw new HttpError(500, 'YouTube is not configured on the server.')
  }

  const videos: PathVideo[] = []

  for (const module of modules) {
    let searchItems: YouTubeSearchItem[]
    try {
      searchItems = await searchVideosForModule(module, form, apiKey, signal)
    } catch (error) {
      throw new Error(
        `YouTube search failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      )
    }

    const candidateIds = searchItems
      .map((item) => item.id?.videoId)
      .filter((id): id is string => Boolean(id))
      .slice(0, Math.max(VIDEOS_PER_MODULE, 3))

    if (candidateIds.length === 0) {
      continue
    }

    let details: Map<string, YouTubeVideoItem>
    try {
      details = await hydrateVideoDetails(candidateIds, apiKey, signal)
    } catch (error) {
      throw new Error(
        `YouTube details failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      )
    }

    let added = 0
    for (const videoId of candidateIds) {
      if (added >= VIDEOS_PER_MODULE) break
      const detail = details.get(videoId)
      const searchItem = searchItems.find((item) => item.id?.videoId === videoId)
      const title = detail?.snippet?.title || searchItem?.snippet?.title
      const channel = detail?.snippet?.channelTitle || searchItem?.snippet?.channelTitle
      if (!title || !channel) continue

      added += 1
      videos.push({
        id: videoId,
        videoId,
        title,
        channel,
        duration: formatDuration(detail?.contentDetails?.duration),
        week: module.week,
        reason: module.reason,
        type: module.type,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail: pickThumbnail(detail || searchItem || {}),
        description: (detail?.snippet?.description || searchItem?.snippet?.description || '')
          .trim()
          .slice(0, 220),
        moduleTitle: module.title,
      })
    }
  }

  if (videos.length === 0) {
    throw new HttpError(
      502,
      'No matching YouTube videos were found for this path. Try a broader topic.',
    )
  }

  return videos
}
