import type { BoardStrokeUpdate, BoardUpdate } from './Update'

export class BoardStroke {
  color: string
  size: number

  constructor() {
    this.color = 'black'
    this.size = 4
  }

  update(update: BoardUpdate): boolean {
    if (update.type == 'setStroke') return this.updateSetStroke(update)

    return false
  }

  private updateSetStroke(update: BoardStrokeUpdate): boolean {
    if (update.color) this.color = update.color
    if (update.size) this.size = update.size

    return true
  }
}
