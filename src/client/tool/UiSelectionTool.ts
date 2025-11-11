import { generateRandomId } from '@/model/board/BoardObject'
import type { UiController } from '../controller/UiController'
import type { BoardMouseEvent } from '../controller/UiMouseController'
import { UiBaseTool } from './UiBaseTool'

export class UiSelectionTool extends UiBaseTool {
  constructor(controller: UiController) {
    super(controller)
  }

  mouseDown(e: BoardMouseEvent) {
    const objects = Array.from(this.controller.board.objects.values())
    objects.reverse()

    for (const obj of objects) {
      const { cx, cy, w, h } = obj.getBoundingRect()
      if (
        e.boardX > cx - w / 2 &&
        e.boardX < cx + w / 2 &&
        e.boardY > cy - h / 2 &&
        e.boardY < cy + h / 2
      ) {
        if(e.isShifted) {
          this.controller.selection.addSelected(obj.id)
        } else {
          this.controller.selection.select(obj.id)
        }
        return
      }
    }

    this.controller.selection.deselect()
  }


  get name(): string {
    return 'selection'
  }
}
