import { BoardObject, generateRandomId } from '@/model/board/BoardObject'
import type { UiController } from '../controller/UiController'
import type { BoardMouseEvent } from '../controller/UiMouseController'
import { UiBaseTool } from './UiBaseTool'
import type { BoardAddUpdate } from '@/model/board/Update'

export class UiShapeTool extends UiBaseTool {
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

    const id = generateRandomId()
    
    this.createObject(id)
    this.controller.updateDispatcher.update({
      type: 'move',
      id,
      deltaX: (x1 + x2) / 2,
      deltaY: (y1 + y2) / 2,
    })
    this.controller.updateDispatcher.update({
      type: 'setShape',
      id,
      width: w,
      height: h,
      shape: 'rect',
      filled: false,
    })
    this.controller.updateDispatcher.update(this.controller.stroke.generateUpdate(id))
  }

  get name(): string {
    return 'shape'
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.startPos && this.lastPos) {
      const [x1, y1] = this.startPos
      const [x2, y2] = this.lastPos

      ctx.strokeStyle = this.controller.stroke.color
      ctx.lineWidth = this.controller.stroke.size
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
    }
  }

  protected createObject(id: string) {
    this.controller.updateDispatcher.update({
      type: 'addObject',
      kind: 'shape',
      id,
    })
  }
}
