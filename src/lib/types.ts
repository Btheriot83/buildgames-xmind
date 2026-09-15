export type NodeId = string
export type EdgeId = string

export interface MapNode {
  id: NodeId
  text: string
  x: number
  y: number
  width: number
  height: number
  parentId: NodeId | null
  color?: string
}

export interface MapEdge {
  id: EdgeId
  from: NodeId
  to: NodeId
}

export interface MindMap {
  id: string
  title: string
  nodes: MapNode[]
  edges: MapEdge[]
  updatedAt: number
  /** Sample maps are clearly labelled and easy to delete. */
  isSample?: boolean
}

export interface MapStats {
  nodeCount: number
  depth: number
  edgeCount: number
}

export const MIN_NODE_W = 120
export const MIN_NODE_H = 44
export const MAX_NODE_W = 420
export const MAX_NODE_H = 240
