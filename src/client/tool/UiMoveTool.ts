import type { BoardMouseEvent } from '../controller/UiMouseController'
import { UiBaseTool } from './UiBaseTool'

export class UiMoveTool extends UiBaseTool {
  mouseDown(e: BoardMouseEvent): void {
    if (e.isLeftDown) {
      if(!this.controller.selection.isInsideSelected(e.boardX, e.boardY)) {
        this.controller.selection.deselect()
      }
    }

    if(this.controller.selection.selectedId.length == 0) {
      this.controller.tool.enableNotSelected();
      this.controller.tool.currentTool?.mouseDown(e)
    }
  }

  mouseMove(e: BoardMouseEvent): void {
    if (e.isLeftDown) {
      this.controller.selection.selectedId.forEach(id=>{
        this.controller.updateDispatcher.update({
          type: 'move',
          id,
          deltaX: e.dx,
          deltaY: e.dy
        })
      })
    }
  }

  get name(): string {
    return 'move'
  }

  activate(): void {
    if(this.controller.selection.selectedId.length == 0) {
      this.controller.tool.enableNotSelected();
    }
  }
}
