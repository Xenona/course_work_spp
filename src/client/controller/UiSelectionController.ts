import type { Board } from '@/model/board/Board'
import type { BoardObject } from '@/model/board/BoardObject'

export class UiSelectionController extends EventTarget {
  selectedId: string[] = []
  board: Board

  constructor(board: Board) {
    super()
    this.board = board
  }

  select(id: string) {
    this.selectedId = [id]
    this.dispatchEvent(new Event('change'))
  }

  deselect() {
    this.selectedId = []
    this.dispatchEvent(new Event('change'))
  }

  addSelected(id: string) {
    if (this.selectedId.includes(id)) return
    this.selectedId.push(id)
    this.dispatchEvent(new Event('change'))
  }

  removeSelected(id: string) {
    if (!this.selectedId.includes(id)) return
    this.selectedId = this.selectedId.filter((e) => e != id)
    this.dispatchEvent(new Event('change'))
  }

  isInsideSelected(x: number, y: number): boolean {
    for (const id of this.selectedId) {
      const obj = this.board.objects.get(id)
      if (!obj) continue

      const { cx, cy, w, h } = obj?.getBoundingRect()
      if (
        x > cx - w / 2 &&
        x < cx + w / 2 &&
        y > cy - h / 2 &&
        y < cy + h / 2
      ) {
        return true
      }
    }
    return false
  }

  get objects() {
    return this.selectedId.map((id) => this.board.objects.get(id)).filter((e) => e) as BoardObject[]
  }
}
