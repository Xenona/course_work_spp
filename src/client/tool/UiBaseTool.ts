import type { UiController } from '../controller/UiController'
import type { BoardMouseEvent } from '../controller/UiMouseController'
import type { ITool } from '../controller/UiToolController'

export class UiBaseTool implements ITool {
  controller: UiController

  constructor(controller: UiController) {
    this.controller = controller
  }

  mouseDown(e: BoardMouseEvent): void {}
  mouseMove(e: BoardMouseEvent): void {}
  mouseUp(e: BoardMouseEvent): void {}

  get name(): string {
    return 'base'
  }
}
