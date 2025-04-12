import type { BoardMouseEvent } from '../controller/UiMouseController'
import { UiBaseTool } from './UiBaseTool'

export class UiMoveTool extends UiBaseTool {
  mouseMove(e: BoardMouseEvent): void {
    if (e.isMiddleDown || e.isLeftDown) this.controller.pos.move(e.dx, e.dy)
  }

  get name(): string {
    return 'move'
  }
}
