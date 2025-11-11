import type { Board } from '../Board'
import { BoardObject } from '../BoardObject'
import { BoardPosition } from '../parts/BoardPosition'
import type {
  BoardAddPointUpdate,
  BoardAnchorUpdate,
  BoardSetImageUpdate,
  BoardUpdate,
} from '../Update'

export class BoardAnchor extends BoardObject {
  pos: BoardPosition

  target: [number, number]

  constructor(board: Board, id: string) {
    super(board, id)
    this.pos = new BoardPosition()
    this.target = [0, 0]
  }

  update(update: BoardUpdate): boolean {
    if (this.pos.update(update)) return true

    if (update.type == 'setAnchor') return this.handleSetAnchor(update)

    return super.update(update)
  }

  handleSetAnchor(update: BoardAnchorUpdate) {
    this.target = [update.target[0], update.target[1]]
    return true
  }

  getBoundingRect() {
    return {
      cx: this.pos.x,
      cy: this.pos.y-16,
      w: 40,
      h: 40,
    }
  }

  get name() {
    return 'Anchor ' + this.id.slice(0, 8)
  }
}
