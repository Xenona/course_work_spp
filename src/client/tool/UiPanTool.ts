import type { BoardMouseEvent } from '../controller/UiMouseController'
import { UiBaseTool } from './UiBaseTool'

export class UiPanTool extends UiBaseTool {
  mouseMove(e: BoardMouseEvent): void {
    if (e.isMiddleDown || e.isLeftDown) this.controller.pos.move(e.dx, e.dy)
  }

  get name(): string {
    return 'pan'
  }

  activate(): void {
    this.controller.selection.deselect()
    super.activate()
  }
}
