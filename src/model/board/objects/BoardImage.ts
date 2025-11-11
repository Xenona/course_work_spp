import type { Board } from '../Board'
import { BoardObject } from '../BoardObject'
import { BoardPosition } from '../parts/BoardPosition'
import type {
  BoardAddPointUpdate,
  BoardSetImageUpdate,
  BoardUpdate,
} from '../Update'

export class BoardImage extends BoardObject {
  pos: BoardPosition

  src: string
  width: number
  height: number

  constructor(board: Board, id: string) {
    super(board, id)
    this.pos = new BoardPosition()
    this.src = ''
    this.width = 0
    this.height = 0
  }

  update(update: BoardUpdate): boolean {
    if (this.pos.update(update)) return true

    if (update.type == 'setImage') return this.handleSetImage(update)

    return super.update(update)
  }

  handleSetImage(update: BoardSetImageUpdate) {
    this.src = update.src
    this.width = update.width
    this.height = update.height
    return true
  }

  getBoundingRect() {
    return {
      cx: this.pos.x,
      cy: this.pos.y,
      w: this.width,
      h: this.height,
    }
  }

  get name() {
    return 'Image ' + this.id.slice(0, 8)
  }
}
