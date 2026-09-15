import { create } from 'zustand'
import {
  addChild,
  computeStats,
  connectNodes,
  createEmptyMap,
  deleteNode,
  moveNode,
  resizeNode,
  updateNodeText,
  validateImportedMap,
} from '../lib/model'
import { expandNodeAi, outlineToMapAi } from '../lib/aiClient'
import {
  addChildrenLabels,
  addSibling,
  mapFromOutlineTree,
  parseOutlineText,
} from '../lib/outline'
import { buildSampleMap } from '../lib/sample'
import {
  deleteMap as dbDelete,
  getLastMapId,
  listMaps,
  loadMap,
  saveMap,
} from '../lib/storage'
import type { MapStats, MindMap, NodeId } from '../lib/types'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
export type LoadStatus = 'boot' | 'loading' | 'ready' | 'empty' | 'error'

interface ToastState {
  message: string
  kind: 'ok' | 'err' | 'info'
  open: boolean
}

interface MapStore {
  maps: MindMap[]
  map: MindMap | null
  selectedId: NodeId | null
  connectFrom: NodeId | null
  loadStatus: LoadStatus
  saveStatus: SaveStatus
  toast: ToastState
  stats: MapStats
  showSuccess: boolean
  boot: () => Promise<void>
  select: (id: NodeId | null) => void
  setConnectFrom: (id: NodeId | null) => void
  newMap: () => Promise<void>
  openMap: (id: string) => Promise<void>
  removeMap: (id: string) => Promise<void>
  seedSample: () => Promise<void>
  patchTitle: (title: string) => void
  addChildToSelected: () => void
  move: (id: NodeId, x: number, y: number) => void
  resize: (id: NodeId, w: number, h: number) => void
  renameNode: (id: NodeId, text: string) => void
  connect: (to: NodeId) => void
  removeSelected: () => void
  importJson: (raw: unknown) => Promise<boolean>
  persist: () => Promise<void>
  flashToast: (message: string, kind?: ToastState['kind']) => void
  flashSuccess: () => void
  clearToast: () => void
  addSiblingToSelected: () => void
  expandSelectedAi: () => Promise<void>
  outlineToMap: (outline: string, opts?: { useAi?: boolean; title?: string }) => Promise<void>
  aiBusy: boolean
}

let saveTimer: ReturnType<typeof setTimeout> | null = null

function statsOf(map: MindMap | null): MapStats {
  return map ? computeStats(map) : { nodeCount: 0, depth: 0, edgeCount: 0 }
}

export const useMapStore = create<MapStore>((set, get) => ({
  maps: [],
  map: null,
  selectedId: null,
  connectFrom: null,
  loadStatus: 'boot',
  saveStatus: 'idle',
  toast: { message: '', kind: 'info', open: false },
  stats: { nodeCount: 0, depth: 0, edgeCount: 0 },
  showSuccess: false,
  aiBusy: false,

  boot: async () => {
    set({ loadStatus: 'loading' })
    try {
      let maps = await listMaps()
      // Phase B2 reseed: replace legacy SAMPLE product-launch maps with real desk content
      const legacy = maps.filter((m) => /SAMPLE/i.test(m.title) || m.id === 'sample-product-launch')
      if (legacy.length) {
        for (const m of legacy) await dbDelete(m.id)
        maps = await listMaps()
      }
      if (maps.length === 0) {
        const sample = buildSampleMap()
        await saveMap(sample)
        maps = [sample]
      }
      const last = await getLastMapId()
      const map = (last && maps.find((m) => m.id === last)) || maps[0]
      set({
        maps,
        map,
        selectedId: map.nodes[0]?.id ?? null,
        loadStatus: 'ready',
        stats: statsOf(map),
      })
    } catch {
      set({ loadStatus: 'error' })
      get().flashToast('IndexedDB unavailable — maps will not autosave.', 'err')
    }
  },

  select: (id) => set({ selectedId: id }),
  setConnectFrom: (id) => set({ connectFrom: id }),

  newMap: async () => {
    const map = createEmptyMap('Untitled map')
    await saveMap(map)
    const maps = await listMaps()
    set({ maps, map, selectedId: map.nodes[0]?.id ?? null, stats: statsOf(map), loadStatus: 'ready' })
    get().flashToast('New map created', 'ok')
  },

  openMap: async (id) => {
    const map = await loadMap(id)
    if (!map) {
      get().flashToast('Map not found', 'err')
      return
    }
    await saveMap(map)
    set({ map, selectedId: map.nodes[0]?.id ?? null, stats: statsOf(map) })
  },

  removeMap: async (id) => {
    await dbDelete(id)
    let maps = await listMaps()
    if (maps.length === 0) {
      set({ maps: [], map: null, selectedId: null, loadStatus: 'empty', stats: statsOf(null) })
      get().flashToast('All maps deleted', 'info')
      return
    }
    const map = maps[0]
    set({ maps, map, selectedId: map.nodes[0]?.id ?? null, stats: statsOf(map) })
    get().flashToast('Map deleted', 'ok')
  },

  seedSample: async () => {
    const existing = await listMaps()
    for (const m of existing) {
      if (m.isSample) await dbDelete(m.id)
    }
    const sample = buildSampleMap()
    sample.id = 'sample-diesel-week'
    await saveMap(sample)
    const maps = await listMaps()
    set({ maps, map: sample, selectedId: sample.nodes[0]?.id ?? null, stats: statsOf(sample), loadStatus: 'ready' })
    // beat21 cut: no seed toast — board itself is the confirmation
  },

  patchTitle: (title) => {
    const map = get().map
    if (!map) return
    const next = { ...map, title: title.slice(0, 120), updatedAt: Date.now() }
    set({ map: next, stats: statsOf(next) })
    get().persist()
  },

  addChildToSelected: () => {
    const { map, selectedId } = get()
    if (!map || !selectedId) return
    const next = addChild(map, selectedId)
    const child = next.nodes[next.nodes.length - 1]
    set({ map: next, selectedId: child?.id ?? selectedId, stats: statsOf(next) })
    get().persist()
  },

  move: (id, x, y) => {
    const map = get().map
    if (!map) return
    const next = moveNode(map, id, x, y)
    set({ map: next, stats: statsOf(next) })
    get().persist()
  },

  resize: (id, w, h) => {
    const map = get().map
    if (!map) return
    const next = resizeNode(map, id, w, h)
    set({ map: next, stats: statsOf(next) })
    get().persist()
  },

  renameNode: (id, text) => {
    const map = get().map
    if (!map) return
    const next = updateNodeText(map, id, text)
    set({ map: next, stats: statsOf(next) })
    get().persist()
  },

  connect: (to) => {
    const { map, connectFrom } = get()
    if (!map || !connectFrom) return
    const next = connectNodes(map, connectFrom, to)
    set({ map: next, connectFrom: null, stats: statsOf(next) })
    get().persist()
    get().flashToast('Nodes connected', 'ok')
  },

  removeSelected: () => {
    const { map, selectedId } = get()
    if (!map || !selectedId) return
    const next = deleteNode(map, selectedId)
    if (next === map) {
      get().flashToast('Cannot delete the central node', 'err')
      return
    }
    set({ map: next, selectedId: next.nodes[0]?.id ?? null, stats: statsOf(next) })
    get().persist()
  },

  importJson: async (raw) => {
    const parsed = validateImportedMap(raw)
    if (!parsed) {
      get().flashToast('Invalid map JSON', 'err')
      return false
    }
    await saveMap(parsed)
    const maps = await listMaps()
    set({ maps, map: parsed, selectedId: parsed.nodes[0]?.id ?? null, stats: statsOf(parsed), loadStatus: 'ready' })
    get().flashToast('Map imported', 'ok')
    return true
  },

  persist: async () => {
    const map = get().map
    if (!map) return
    if (saveTimer) clearTimeout(saveTimer)
    set({ saveStatus: 'saving' })
    saveTimer = setTimeout(async () => {
      try {
        await saveMap(map)
        const maps = await listMaps()
        set({ maps, saveStatus: 'saved' })
        setTimeout(() => {
          if (get().saveStatus === 'saved') set({ saveStatus: 'idle' })
        }, 1200)
      } catch {
        set({ saveStatus: 'error' })
        get().flashToast('Autosave failed', 'err')
      }
    }, 350)
  },


  addSiblingToSelected: () => {
    const { map, selectedId } = get()
    if (!map || !selectedId) return
    const next = addSibling(map, selectedId)
    const child = next.nodes[next.nodes.length - 1]
    set({ map: next, selectedId: child?.id ?? selectedId, stats: statsOf(next) })
    get().persist()
  },

  expandSelectedAi: async () => {
    const { map, selectedId } = get()
    if (!map || !selectedId || get().aiBusy) return
    const node = map.nodes.find((n) => n.id === selectedId)
    if (!node) return
    const context = map.nodes
      .filter((n) => n.parentId === selectedId || n.parentId === node.parentId)
      .map((n) => n.text)
      .slice(0, 12)
    set({ aiBusy: true })
    try {
      const out = await expandNodeAi(node.text, context, 5)
      const next = addChildrenLabels(map, selectedId, out.children)
      const last = next.nodes[next.nodes.length - 1]
      set({ map: next, selectedId: last?.id ?? selectedId, stats: statsOf(next) })
      get().persist()
      get().flashToast(`Expanded via ${out.provider}`, 'ok')
    } catch (e) {
      get().flashToast(e instanceof Error ? e.message : 'Expand failed', 'err')
    } finally {
      set({ aiBusy: false })
    }
  },

  outlineToMap: async (outline, opts) => {
    const raw = outline.trim()
    if (raw.length < 3) {
      get().flashToast('Paste a longer outline', 'err')
      return
    }
    set({ aiBusy: true })
    try {
      let tree = parseOutlineText(raw)
      let title = opts?.title
      let note = 'Outline laid out locally'
      if (opts?.useAi === true) {
        try {
          const out = await outlineToMapAi(raw, title)
          tree = out.root
          title = out.title
          note = `Map grown via ${out.provider}`
        } catch {
          note = 'Outline parsed locally (AI unavailable)'
        }
      }
      if (!tree) {
        get().flashToast('Could not parse outline', 'err')
        return
      }
      const map = mapFromOutlineTree(tree, title)
      await saveMap(map)
      const maps = await listMaps()
      set({
        maps,
        map,
        selectedId: map.nodes[0]?.id ?? null,
        stats: statsOf(map),
        loadStatus: 'ready',
      })
      get().flashToast(note, 'ok')
    } catch (e) {
      get().flashToast(e instanceof Error ? e.message : 'Outline failed', 'err')
    } finally {
      set({ aiBusy: false })
    }
  },

  flashToast: (message, kind = 'info') => {
    set({ toast: { message, kind, open: true } })
    setTimeout(() => {
      const t = get().toast
      if (t.message === message) set({ toast: { ...t, open: false } })
    }, 2600)
  },

  flashSuccess: () => {
    set({ showSuccess: true })
    setTimeout(() => set({ showSuccess: false }), 1600)
  },

  clearToast: () => set({ toast: { ...get().toast, open: false } }),
}))
