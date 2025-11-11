import type { Board } from './Board'
import { BoardObject } from './BoardObject'
import type {
  BoardAddPointUpdate,
  BoardSetImageUpdate,
  BoardUpdate,
} from './Update'

export class BoardImage extends BoardObject {
  src: string
  width: number
  height: number
  posX: number
  posY: number

  constructor(board: Board, id: string) {
    super(board, id)

    this.src = ''
    this.width = 0
    this.height = 0
    this.posX = 0
    this.posY = 0
  }

  update(update: BoardUpdate): boolean {
    if (update.type == 'setImage') return this.handleSetImage(update)

    return super.update(update)
  }

  handleSetImage(update: BoardSetImageUpdate) {
    this.src = update.src
    this.width = update.width
    this.height = update.height
    this.posX = update.posX
    this.posY = update.posY
    return true
  }

  getBoundingRect() {
    return {
      cx: this.posX,
      cy: this.posY,
      w: this.width,
      h: this.height,
    }
  }

  get name() {
    return 'Image ' + this.id.slice(0, 8)
  }
}
