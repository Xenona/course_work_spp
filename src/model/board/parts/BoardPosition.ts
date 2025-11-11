import type { BoardMoveUpdate, BoardUpdate } from '../Update'

export class BoardPosition {
  x: number
  y: number

  constructor() {
    this.x = 0
    this.y = 0
  }

  update(update: BoardUpdate): boolean {
    if (update.type == 'move') return this.updateMove(update)

    return false
  }

  private updateMove(update: BoardMoveUpdate): boolean {
    this.x += update.deltaX
    this.y += update.deltaY

    return true
  }
}
