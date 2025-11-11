import type { IRendererOverlay } from '@/renderer/IRendererOverlay'
import type { UiController } from '../controller/UiController'

export class UiToolOverlay implements IRendererOverlay {
  private controller: UiController

  constructor(controller: UiController) {
    this.controller = controller
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.controller.tool.currentTool?.draw(ctx)
  }
}
