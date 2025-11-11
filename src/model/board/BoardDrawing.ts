import { BoardObject } from './BoardObject'
import { BoardStroke } from './BoardStroke'
import type { BoardAddPointUpdate, BoardUpdate } from './Update'

export class BoardDrawing extends BoardObject {
  points: [number, number][]

  stroke: BoardStroke

  constructor(id: string) {
    super(id)
    this.points = []
    this.stroke = new BoardStroke()
  }

  update(update: BoardUpdate): boolean {
    if (this.stroke.update(update)) return true

    if (update.type == 'addPoint') return this.handleAddPoint(update)

    return super.update(update)
  }

  private handleAddPoint(update: BoardAddPointUpdate): boolean {
    this.points.push(update.point)
    return true
  }

  getBoundingRect() {
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    for (let point of this.points) {
      minX = Math.min(minX, point[0])
      minY = Math.min(minY, point[1])
      maxX = Math.max(maxX, point[0])
      maxY = Math.max(maxY, point[1])
    }
    return {
      cx: (maxX + minX) / 2,
      cy: (maxY + minY) / 2,
      w: maxX - minX + this.stroke.size,
      h: maxY - minY + this.stroke.size,
    }
  }

  get name() {
    return 'Drawing ' + this.id.slice(0, 8)
  }
}
