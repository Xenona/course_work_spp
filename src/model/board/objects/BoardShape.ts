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

  constructor(board: Board, id: string) {
    super(board, id)
    this.pos = new BoardPosition()
    this.stroke = new BoardStroke()
    this.width = 0
    this.height = 0
  }

  update(update: BoardUpdate): boolean {
    console.log(update)
    if (this.pos.update(update)) return true
    if (this.stroke.update(update)) return true

    if (update.type == 'setShape') return this.handleSetShape(update)

    return super.update(update)
  }

  handleSetShape(update: BoardShapeUpdate) {
    this.width = update.width
    this.height = update.height
    return true
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
