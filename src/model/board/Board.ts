import { BoardAnimation } from './BoardAnimation'
import { BoardDrawing } from './BoardDrawing'
import { BoardGroup } from './BoardGroup'
import type { BoardObject } from './BoardObject'
import type {
  BoardAddUpdate,
  BoardDeleteUpdate,
  BoardGroupUpdate,
  BoardUpdate,
} from './Update'

export class Board {
  objects: Map<string, BoardObject>
  rootGroup: BoardGroup

  constructor() {
    this.objects = new Map()
    this.rootGroup = new BoardGroup('root')
    this.objects.set(this.rootGroup.id, this.rootGroup)
  }

  update(update: BoardUpdate): boolean {
    if (update.type == 'addObject') return this.handleAddObject(update)
    if (update.type == 'addMember') return this.handleAddMember(update)
    if (update.type == 'deleteObject') return this.handleDeleteMember(update)

    if (this.objects.has(update.id)) {
      if (!this.objects.get(update.id)?.update(update)) {
        console.warn('Unhandled update', update)
        return false
      } else {
        return true
      }
    }

    console.warn('Invalid target id update', update)
    return false
  }

  private handleAddObject(update: BoardAddUpdate): boolean {
    let obj: BoardObject
    if (update.kind == 'drawing') {
      obj = new BoardDrawing(update.id)
    } else if (update.kind == 'group') {
      obj = new BoardGroup(update.id)
    } else if (update.kind == 'animation') {
      obj = new BoardAnimation(update.id)
    } else {
      console.warn('Unknown kind', update.kind)
      return false
    }
    this.objects.set(obj.id, obj)
    obj.parent = this.rootGroup.id
    this.rootGroup.objects.push(obj.id)
    return true
  }

  private handleAddMember(update: BoardGroupUpdate): boolean {
    const obj = this.objects.get(update.id)
    if (!obj) return false
    const member = this.objects.get(update.memberId)
    if (!member) return false

    this.removeFromGroup(member)
    if (obj.update(update)) {
      member.parent = obj.id
      return true
    } else {
      return false
    }
  }

  private handleDeleteMember(update: BoardDeleteUpdate): boolean {
    const obj = this.objects.get(update.id)
    if (!obj) return false

    this.removeFromGroup(obj)
    this.objects.delete(update.id)
    return true
  }

  private removeFromGroup(obj: BoardObject) {
    if (!obj) return

    const parent = this.objects.get(obj.parent ?? '')
    if (parent) {
      ;(parent as BoardGroup).objects = (parent as BoardGroup).objects.filter(
        (e) => e != obj.id
      )
    }
  }
}
