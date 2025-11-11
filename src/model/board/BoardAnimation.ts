import { BoardDrawing } from './BoardDrawing'
import { BoardGroup } from './BoardGroup'
import { BoardObject } from './BoardObject'
import type { BoardGroupUpdate, BoardUpdate } from './Update'

export class BoardAnimation extends BoardGroup {
  constructor(id: string) {
    super(id)
  }

  get name() {
    return 'Animation ' + this.id.slice(0, 8)
  }
}
