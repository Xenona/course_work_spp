import type { BoardStroke } from "./BoardStroke"
import type { BoardUpdate } from "./Update"

export function generateRandomId() {
  const parts = []
  for (let i = 0; i < 4; i++) {
    parts.push(Math.floor(Math.random() * 0xffffffff))
  }
  return parts.map((e) => e.toString(16).padStart(8, '0')).join('_')
}

export class BoardObject {
  id: string
  stroke: BoardStroke | undefined
  parent: string | undefined

  constructor(id: string) {
    this.id = id
  }

  update(update: BoardUpdate): boolean {
    return false
  }

  getBoundingRect() {
    return { cx: 0, cy: 0, w: 0, h: 0 }
  }

  get name() {
    return 'Object ' + this.id.slice(0, 8)
  }
}
