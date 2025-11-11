import type { UiController } from '../controller/UiController'
import type { BoardMouseEvent } from '../controller/UiMouseController'
import { UiBaseAddTool } from './UiBaseAddTool'

export class UiTextTool extends UiBaseAddTool {
  constructor(controller: UiController) {
    super(controller)
  }

  doAdd(id: string, e: BoardMouseEvent) {
    this.controller.updateDispatcher.update({
      type: 'addObject',
      kind: 'text',
      id,
    })
  }

  get name(): string {
    return 'text'
  }
}
