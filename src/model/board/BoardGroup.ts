import { BoardDrawing } from './BoardDrawing'
import { BoardObject } from './BoardObject'
import type { BoardGroupUpdate, BoardUpdate } from './Update'

export class BoardGroup extends BoardObject {
  objects: string[] = []

  constructor(id: string) {
    super(id)
  }

  update(update: BoardUpdate): boolean {
    if (update.type == 'addMember') {
      this.objects.push(update.memberId)
      return true
    }

    return super.update(update)
  }

  get name() {
    return 'Group ' + this.id.slice(0, 8)
  }
}
