import { BoardDrawing } from './BoardDrawing'
import type { BoardObject } from './BoardObject'
import type { BoardUpdate } from './Update'

export class Board {
  objects: Map<string, BoardObject>

  constructor() {
    this.objects = new Map()
  }

  addObject(object: BoardObject) {
    this.objects.set(object.id, object)
  }

  update(update: BoardUpdate): boolean {
    if (update.type == 'addObject') {
      if (update.kind == 'drawing') {
        this.addObject(new BoardDrawing(update.id))
      } else {
        console.warn('Unknown kind', update.kind)
      }
      return true
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
