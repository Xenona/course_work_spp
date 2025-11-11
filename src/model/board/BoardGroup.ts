import { BoardDrawing } from './BoardDrawing'
import { BoardObject } from './BoardObject'
import type { BoardGroupUpdate, BoardUpdate } from './Update'

export class BoardGroup extends BoardObject {
  objects: string[] = []

  constructor(id: string) {
    super(id)
  }

  update(update: BoardUpdate): boolean {
    if (update.type == 'addMember') return this.handleAddMember(update)

    return super.update(update)
  }

  private handleAddMember(update: BoardGroupUpdate): boolean {
    this.objects.push(update.memberId)
    return true
  }

  get name() {
    return 'Group ' + this.id.slice(0, 8)
  }
}
