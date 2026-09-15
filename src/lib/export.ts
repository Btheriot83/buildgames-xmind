import { saveAs } from 'file-saver'
import type { MindMap } from './types'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function mapToSvg(map: MindMap): string {
  const pad = 40
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity
  for (const n of map.nodes) {
    minX = Math.min(minX, n.x)
    minY = Math.min(minY, n.y)
    maxX = Math.max(maxX, n.x + n.width)
    maxY = Math.max(maxY, n.y + n.height)
  }
  if (!Number.isFinite(minX)) {
    minX = 0
    minY = 0
    maxX = 800
    maxY = 600
  }
  const w = maxX - minX + pad * 2
  const h = maxY - minY + pad * 2
  const ox = -minX + pad
  const oy = -minY + pad

  const byId = new Map(map.nodes.map((n) => [n.id, n]))
  const lines = map.edges
    .map((e) => {
      const a = byId.get(e.from)
      const b = byId.get(e.to)
      if (!a || !b) return ''
      const x1 = a.x + a.width / 2 + ox
      const y1 = a.y + a.height / 2 + oy
      const x2 = b.x + b.width / 2 + ox
      const y2 = b.y + b.height / 2 + oy
      const mx = (x1 + x2) / 2
      return `<path d="M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}" fill="none" stroke="#1d8d80" stroke-width="2.5" opacity="0.85"/>`
    })
    .join('\n')

  const rects = map.nodes
    .map((n) => {
      const isRoot = n.parentId == null
      const fill = isRoot ? '#da843f' : '#1a1d24'
      const stroke = isRoot ? '#f0b27a' : '#2a3140'
      const textFill = isRoot ? '#12141a' : '#f2ebe0'
      return `<g>
  <rect x="${n.x + ox}" y="${n.y + oy}" width="${n.width}" height="${n.height}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
  <text x="${n.x + ox + n.width / 2}" y="${n.y + oy + n.height / 2 + 5}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="14" fill="${textFill}">${escapeXml(n.text)}</text>
</g>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <title>${escapeXml(map.title)} — Shop Chalk Map</title>
  <desc>Exported from Shop Chalk Map</desc>
  <rect width="100%" height="100%" fill="#12141a"/>
  ${lines}
  ${rects}
</svg>`
}

export function downloadSvg(map: MindMap): void {
  const svg = mapToSvg(map)
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  saveAs(blob, `${safeName(map.title)}.svg`)
}

export async function downloadPng(map: MindMap): Promise<void> {
  const svg = mapToSvg(map)
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  try {
    const img = new Image()
    const loaded = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('PNG render failed'))
    })
    img.src = url
    await loaded
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth || 1200
    canvas.height = img.naturalHeight || 800
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas unavailable')
    ctx.fillStyle = '#12141a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)
    await new Promise<void>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (!b) return reject(new Error('PNG encode failed'))
        saveAs(b, `${safeName(map.title)}.png`)
        resolve()
      }, 'image/png')
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function downloadJson(map: MindMap): void {
  const blob = new Blob([JSON.stringify(map, null, 2)], { type: 'application/json' })
  saveAs(blob, `${safeName(map.title)}.json`)
}

function safeName(title: string): string {
  return title.replace(/[^\w\-]+/g, '_').slice(0, 60) || 'mindmap'
}
