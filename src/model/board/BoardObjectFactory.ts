import type { Board } from './Board'
import { BoardGroup } from './BoardGroup'
import type { BoardObject } from './BoardObject'
import { BoardAnimation } from './objects/BoardAnimation'
import { BoardDrawing } from './objects/BoardDrawing'
import { BoardImage } from './objects/BoardImage'
import { BoardShape } from './objects/BoardShape'
import type { BoardAddUpdate } from './Update'

export class BoardObjectFactory {
  registry: Map<BoardAddUpdate["kind"], any> = new Map()

  constructor() {
    this.registry.set('image', BoardImage)
    this.registry.set('shape', BoardShape)
    this.registry.set('group', BoardGroup)
    this.registry.set('drawing', BoardDrawing)
    this.registry.set('animation', BoardAnimation)
  }

  construct(board: Board, update: BoardAddUpdate): BoardObject {
    console.log('Constructing', update)
    const cls = this.registry.get(update.kind)
    if (!cls) {
      throw new Error('Unknown kind ' + update.kind)
    }
    return new cls(board, update.id)
  }
}
