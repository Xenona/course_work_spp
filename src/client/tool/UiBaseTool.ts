import type { UiController } from '../controller/UiController'
import type { BoardMouseEvent } from '../controller/UiMouseController'
import type { ITool } from '../controller/UiToolController'

export class UiBaseTool implements ITool {
  protected controller: UiController
  protected active: boolean

  constructor(controller: UiController) {
    this.controller = controller
    this.active = false
  }

  mouseDown(e: BoardMouseEvent): void {}
  mouseMove(e: BoardMouseEvent): void {}
  mouseUp(e: BoardMouseEvent): void {}

  activate() {
    this.active = true
  }

  deactivate() {
    this.active = false
  }

  get name(): string {
    return 'base'
  }

  draw(ctx: CanvasRenderingContext2D): void {}
}
