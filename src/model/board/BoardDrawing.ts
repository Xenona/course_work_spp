import { BoardObject } from './BoardObject'
import { BoardStroke } from './BoardStroke'
import type { BoardUpdate } from './Update'

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

    if (update.type == 'addPoint') {
      this.points.push(update.point)
      return true
    }

    return super.update(update)
  }
}
