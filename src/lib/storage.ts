import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { MindMap } from './types'

interface SynapseDB extends DBSchema {
  maps: {
    key: string
    value: MindMap
    indexes: { 'by-updated': number }
  }
  meta: {
    key: string
    value: { key: string; lastMapId: string | null }
  }
}

const DB_NAME = 'copper-synapse-xmind'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<SynapseDB>> | null = null

export function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<SynapseDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const maps = db.createObjectStore('maps', { keyPath: 'id' })
        maps.createIndex('by-updated', 'updatedAt')
        db.createObjectStore('meta', { keyPath: 'key' })
      },
    })
  }
  return dbPromise
}

export async function listMaps(): Promise<MindMap[]> {
  const db = await getDb()
  const all = await db.getAll('maps')
  return all.sort((a, b) => b.updatedAt - a.updatedAt)
}

export async function saveMap(map: MindMap): Promise<void> {
  const db = await getDb()
  await db.put('maps', { ...map, updatedAt: Date.now() })
  await db.put('meta', { key: 'session', lastMapId: map.id })
}

export async function loadMap(id: string): Promise<MindMap | undefined> {
  const db = await getDb()
  return db.get('maps', id)
}

export async function deleteMap(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('maps', id)
  const meta = await db.get('meta', 'session')
  if (meta?.lastMapId === id) {
    await db.put('meta', { key: 'session', lastMapId: null })
  }
}

export async function getLastMapId(): Promise<string | null> {
  const db = await getDb()
  const meta = await db.get('meta', 'session')
  return meta?.lastMapId ?? null
}

export { DB_NAME }
