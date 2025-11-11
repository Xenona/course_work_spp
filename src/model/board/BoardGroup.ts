import { BoardObject } from './BoardObject'
import type { BoardGroupUpdate, BoardUpdate } from './Update'

export class BoardGroup extends BoardObject {
  objects: string[] = []

  update(update: BoardUpdate): boolean {
    if (update.type == 'addMember') return this.handleAddMember(update)

    for(const o of this.objects) {
      this.board.update({ ...update, id: o})
    }

    return super.update(update)
  }

  private handleAddMember(update: BoardGroupUpdate): boolean {
    this.objects.push(update.memberId)
    return true
  }

  get name() {
    return 'Group ' + this.id.slice(0, 8)
  }

  getBoundingRect() {
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    if (this.objects.length == 0) return { cx: 0, cy: 0, w: 0, h: 0 }

    for (const objId of this.objects) {
      const obj = this.board.objects.get(objId)
      if (!obj) continue
      const bb = obj.getBoundingRect()

      minX = Math.min(minX, bb.cx - bb.w / 2)
      minY = Math.min(minY, bb.cy - bb.h / 2)
      maxX = Math.max(maxX, bb.cx + bb.w / 2)
      maxY = Math.max(maxY, bb.cy + bb.h / 2)
    }

    return {
      cx: (maxX + minX) / 2,
      cy: (maxY + minY) / 2,
      w: maxX - minX,
      h: maxY - minY,
    }
  }
}
