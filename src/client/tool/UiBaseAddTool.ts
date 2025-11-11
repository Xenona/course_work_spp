import { generateRandomId } from '@/model/board/BoardObject'
import type { UiController } from '../controller/UiController'
import type { BoardMouseEvent } from '../controller/UiMouseController'
import { UiBaseTool } from './UiBaseTool'

export class UiBaseAddTool extends UiBaseTool {
  constructor(controller: UiController) {
    super(controller)
  }

  mouseDown(e: BoardMouseEvent) {
    if (!e.isLeftDown) return
    
    const id = generateRandomId()

    this.doAdd(id, e)
    
    this.controller.updateDispatcher.update({
      type: 'move',
      id,
      deltaX: e.boardX,
      deltaY: e.boardY,
    })


    this.controller.selection.select(id)
    this.controller.tool.enableSelected()
  }

  activate(): void {
    this.controller.selection.deselect()
    super.activate()
  }

  get name(): string {
    return 'anchor'
  }

  protected doAdd(id: string, e: BoardMouseEvent) {
    throw new Error('Method not implemented.')
  }
}
