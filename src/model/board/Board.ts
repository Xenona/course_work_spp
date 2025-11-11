import { BoardAnimation } from './BoardAnimation'
import { BoardDrawing } from './BoardDrawing'
import { BoardGroup } from './BoardGroup'
import type { BoardObject } from './BoardObject'
import type { BoardUpdate } from './Update'

export class Board {
  objects: Map<string, BoardObject>
  rootGroup: BoardGroup

  constructor() {
    this.objects = new Map()
    this.rootGroup = new BoardGroup('root')
    this.objects.set(this.rootGroup.id, this.rootGroup)
  }

  addObject(object: BoardObject) {
    this.objects.set(object.id, object)
  }

  update(update: BoardUpdate): boolean {
    if (update.type == 'addObject') {
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
    } else if (update.type == 'addMember') {
      const obj = this.objects.get(update.id)
      if (!obj) return false

      const parent = this.objects.get(obj.parent ?? '')
      if (parent) {
        ;(parent as BoardGroup).objects = (parent as BoardGroup).objects.filter(
          (e) => e != update.memberId
        )
      }
      // console.log('Pushing', update.memberId, update.id)

      return obj.update(update) ?? false
    } else {
      if (this.objects.has(update.id)) {
        if (!this.objects.get(update.id)?.update(update)) {
          console.warn('Unhandled update', update)
          return false
        } else {
          return true
        }
      } else {
        console.warn('unsend update', update)
        return false
      }
    }
  }
}
