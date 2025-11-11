import type { Board } from '../Board'
import { BoardObject } from '../BoardObject'
import { BoardPosition } from '../parts/BoardPosition'
import { BoardStroke } from '../parts/BoardStroke'
import type { BoardTextUpdate, BoardUpdate } from '../Update'

export class BoardText extends BoardObject {
  pos: BoardPosition
  stroke: BoardStroke
  contents: string

  constructor(board: Board, id: string) {
    super(board, id)
    this.pos = new BoardPosition()
    this.stroke = new BoardStroke()
    this.contents = ''
  }

  update(update: BoardUpdate): boolean {
    if (this.pos.update(update)) return true
    if (this.stroke.update(update)) return true

    if (update.type == 'setText') return this.handleSetText(update)

    return super.update(update)
  }

  protected handleSetText(update: BoardTextUpdate) {
    if (update.text !== undefined) this.contents = update.text

    return true
  }

  getBoundingRect() {
    const lines = this.contents.split('\n')
    const width = Math.max(...lines.map((line) => line.length)) * this.charWidth
    const height = lines.length * this.charHeight

    return {
      cx: this.pos.x,
      cy: this.pos.y,
      w: width,
      h: height,
    }
  }

  get name() {
    return 'Text ' + this.id.slice(0, 8)
  }

  get charHeight() {
    return 10 * this.stroke.size
  }

  get charWidth() {
    return this.charHeight * 0.6
  }
}
