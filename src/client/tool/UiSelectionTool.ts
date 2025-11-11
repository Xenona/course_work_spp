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
        this.controller.selection.select(obj.id)
        return
      }
    }

    this.controller.selection.deselect()
    // console.log('123123')
    // if (!e.isLeftDown) return

    // const id = generateRandomId()
    // this.controller.updateDispatcher.update({
    //   type: 'addObject',
    //   kind: 'drawing',
    //   id,
    // })
    // this.controller.updateDispatcher.update(
    //   this.controller.stroke.generateUpdate(id)
    // )

    // this.controller.updateDispatcher.update({
    //   type: 'addPoint',
    //   id,
    //   point: [e.boardX, e.boardY],
    // })

    // this.currentDrawing = id
  }

  mouseMove(e: BoardMouseEvent) {
    // if (this.currentDrawing) {
    //   this.controller.updateDispatcher.update({
    //     type: 'addPoint',
    //     id: this.currentDrawing,
    //     point: [e.boardX, e.boardY],
    //   })
    // }
  }

  mouseUp(e: BoardMouseEvent) {
    // this.currentDrawing = null
  }

  get name(): string {
    return 'selection'
  }

  protected onStrokeChange = () => {
    if (!this.activate) return
    const id = this.controller.selection.selectedId
    if (!id) return

    this.controller.updateDispatcher.update(
      this.controller.stroke.generateUpdate(id)
    )
  }
}
