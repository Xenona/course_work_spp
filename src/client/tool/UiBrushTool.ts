import { generateRandomId } from '@/model/board/BoardObject'
import type { UiController } from '../controller/UiController'
import type { BoardMouseEvent } from '../controller/UiMouseController'
import { UiBaseTool } from './UiBaseTool'

export class UiBrushTool extends UiBaseTool {
  currentDrawing: string | null

  constructor(controller: UiController) {
    super(controller)

    this.currentDrawing = null
  }

  mouseDown(e: BoardMouseEvent) {
    console.log('123123')
    if (!e.isLeftDown) return

    const id = generateRandomId()
    this.controller.updateDispatcher.update({
      type: 'addObject',
      kind: 'drawing',
      id,
    })
    this.controller.updateDispatcher.update(
      this.controller.stroke.generateUpdate(id)
    )

    this.controller.updateDispatcher.update({
      type: 'addPoint',
      id,
      point: [e.boardX, e.boardY],
    })

    this.currentDrawing = id
  }

  mouseMove(e: BoardMouseEvent) {
    if (this.currentDrawing) {
      this.controller.updateDispatcher.update({
        type: 'addPoint',
        id: this.currentDrawing,
        point: [e.boardX, e.boardY],
      })
    }
  }

  mouseUp(e: BoardMouseEvent) {
    this.currentDrawing = null
  }

  activate(): void {
    this.controller.selection.deselect()
    super.activate()
  }

  get name(): string {
    return 'brush'
  }
}
