import type { IRendererOverlay } from '@/renderer/IRendererOverlay'
import type { UiController } from '../controller/UiController'

export class UiRendererSelection implements IRendererOverlay {
  private controller: UiController

  constructor(controller: UiController) {
    this.controller = controller
    // controller.addEventListener('change', this.draw)
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (let obj of this.controller.board.objects.values()) {
      if (obj.id != this.controller.selection.selectedId) continue
      const { cx, cy, w, h } = obj.getBoundingRect()
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 1
      ctx.strokeRect(cx - w / 2, cy - h / 2, w, h)
    }
    // throw new Error("Method not implemented.");
  }
}
