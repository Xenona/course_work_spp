import { generateRandomId } from '@/model/board/BoardObject'
import type { UiController } from '../controller/UiController'
import type { BoardMouseEvent } from '../controller/UiMouseController'
import { UiBaseTool } from './UiBaseTool'

export class UiSelectionTool extends UiBaseTool {
  private startPos: [number, number] | null
  private lastPos: [number, number] | null

  constructor(controller: UiController) {
    super(controller)
    this.startPos = null
    this.lastPos = null
  }

  mouseDown(e: BoardMouseEvent) {
    if (!e.isShifted) {
      this.controller.selection.deselect()
    }

    this.startPos = [e.boardX, e.boardY]
  }

  mouseMove(e: BoardMouseEvent): void {
    this.lastPos = [e.boardX, e.boardY]
  }

  mouseUp(e: BoardMouseEvent): void {
    if (!this.startPos) return

    const x1 = Math.min(e.boardX, this.startPos[0])
    const y1 = Math.min(e.boardY, this.startPos[1])

    const x2 = Math.max(e.boardX, this.startPos[0])
    const y2 = Math.max(e.boardY, this.startPos[1])

    const w = Math.abs(e.boardX - this.startPos[0])
    const h = Math.abs(e.boardY - this.startPos[1])

    this.lastPos = null
    this.startPos = null

    const objects = Array.from(this.controller.board.objects.values())
    objects.reverse()

    if (w < 3 && h < 3) {
      for (const obj of objects) {
        const { cx, cy, w, h } = obj.getBoundingRect()
        if (
          e.boardX > cx - w / 2 &&
          e.boardX < cx + w / 2 &&
          e.boardY > cy - h / 2 &&
          e.boardY < cy + h / 2
        ) {
          if (e.isShifted) {
            this.controller.selection.addSelected(obj.id)
          } else {
            this.controller.selection.select(obj.id)
          }
          return
        }
      }
      this.controller.selection.deselect()
      return
    } else {
      this.controller.selection.deselect()
      for (const obj of objects) {
        const { cx, cy, w, h } = obj.getBoundingRect()
        if (w == 0 || h == 0) continue

        if (
          x1 < cx - w / 2 &&
          x2 > cx + w / 2 &&
          y1 < cy - h / 2 &&
          y2 > cy + h / 2
        ) {
          this.controller.selection.addSelected(obj.id)
        }
      }
      return
    }
  }

  get name(): string {
    return 'selection'
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.startPos && this.lastPos) {
      const [x1, y1] = this.startPos
      const [x2, y2] = this.lastPos
      console.log(this.startPos, this.lastPos)
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 1
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
    }
  }
}
