import type { BoardObject } from '@/model/board/BoardObject'
import type { BoardMouseEvent } from '../controller/UiMouseController'
import { UiBaseTool } from './UiBaseTool'
import { BoardAnchor } from '@/model/board/objects/BoardAnchor'

export class UiPanTool extends UiBaseTool {
  mouseMove(e: BoardMouseEvent): void {
    if (e.isMiddleDown || e.isLeftDown) this.controller.pos.move(e.dx, e.dy)
  }

  mouseDown(e: BoardMouseEvent): void {
    // TODO: Deduplicate
    const objects = Array.from(this.controller.board.rootGroup.objects).map(
      (e) => this.controller.board.objects.get(e) as BoardObject
    )
    objects.reverse()

    if (e.isMiddleDown || e.isLeftDown) {
      for (const obj of objects) {
        const { cx, cy, w, h } = obj.getBoundingRect()
        if (
          e.boardX > cx - w / 2 &&
          e.boardX < cx + w / 2 &&
          e.boardY > cy - h / 2 &&
          e.boardY < cy + h / 2 &&
          obj instanceof BoardAnchor
        ) {
          this.controller.pos.goto(...obj.target)
        }
      }
    }
  }

  get name(): string {
    return 'pan'
  }

  activate(): void {
    this.controller.selection.deselect()
    super.activate()
  }
}
