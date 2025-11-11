import type { Board } from '../Board'
import { BoardObject } from '../BoardObject'
import { BoardPosition } from '../parts/BoardPosition'
import { BoardStroke } from '../parts/BoardStroke'
import type { BoardShapeUpdate, BoardUpdate } from '../Update'

export class BoardShape extends BoardObject {
  pos: BoardPosition
  stroke: BoardStroke
  width: number
  height: number
  filled: boolean

  constructor(board: Board, id: string) {
    super(board, id)
    this.pos = new BoardPosition()
    this.stroke = new BoardStroke()
    this.width = 0
    this.height = 0
    this.filled = false
  }

  update(update: BoardUpdate): boolean {
    if (this.pos.update(update)) return true
    if (this.stroke.update(update)) return true

    if (update.type == 'setShape') return this.handleSetShape(update)

    return super.update(update)
  }

  protected handleSetShape(update: BoardShapeUpdate) {
    if (update.width !== undefined) this.width = update.width
    if (update.height !== undefined) this.height = update.height
    if (update.filled !== undefined) this.filled = update.filled

    return true
  }

  getUpdateShape() {
    return {
      type: 'setShape',
      id: this.id,
      width: this.width,
      height: this.height,
      filled: this.filled,
    } as const
  }

  getBoundingRect() {
    return {
      cx: this.pos.x,
      cy: this.pos.y,
      w: this.width + (this.stroke?.size ?? 0),
      h: this.height + (this.stroke?.size ?? 0),
    }
  }

  get name() {
    return 'Shape ' + this.id.slice(0, 8)
  }
}
