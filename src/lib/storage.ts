import { DB_VERSION, STORAGE_KEY } from './constants'
import { createSeedDB } from './seed'
import type { PathlyDB } from '../types'

export function loadDB(): PathlyDB {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seeded = createSeedDB()
      saveDB(seeded)
      return seeded
    }
    const parsed = JSON.parse(raw) as PathlyDB
    if (!parsed || parsed.version !== DB_VERSION || !Array.isArray(parsed.users)) {
      const seeded = createSeedDB()
      saveDB(seeded)
      return seeded
    }
    return parsed
  } catch {
    const seeded = createSeedDB()
    saveDB(seeded)
    return seeded
  }
}

export function saveDB(db: PathlyDB): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

export function resetDB(): PathlyDB {
  const seeded = createSeedDB()
  saveDB(seeded)
  return seeded
}
