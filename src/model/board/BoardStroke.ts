import type { BoardUpdate } from './Update'

export class BoardStroke {
  color: string
  size: number

  constructor() {
    this.color = 'black'
    this.size = 4
  }

  update(update: BoardUpdate): boolean {
    if (update.type == 'setStroke') {
      if (update.color) this.color = update.color
      if (update.size) this.size = update.size

      return true
    } else {
      return false
    }
  }
}
