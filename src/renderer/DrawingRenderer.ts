import type { BoardDrawing } from '../model/board/BoardDrawing'
import { ObjectRenderer } from './ObjectRenderer'

export class DrawingRenderer extends ObjectRenderer<BoardDrawing> {
  protected draw(ctx: CanvasRenderingContext2D) {
    if (this.target.points.length == 0) return

    ctx.beginPath()
    ctx.strokeStyle = this.target.stroke.color
    ctx.lineWidth = this.target.stroke.size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.moveTo(...this.target.points[0])

    for (let i = 0; i < this.target.points.length; i++) {
      ctx.lineTo(...this.target.points[i])
    }

    ctx.stroke()
  }
}
