import type { BoardDrawing } from '../model/board/objects/BoardDrawing'
import { ObjectRenderer } from './ObjectRenderer'

export class DrawingRenderer extends ObjectRenderer<BoardDrawing> {
  protected draw(ctx: CanvasRenderingContext2D) {
    if (this.target.points.length == 0) return

    ctx.beginPath()
    ctx.strokeStyle = this.target.stroke.color
    ctx.lineWidth = this.target.stroke.size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const posX = this.target.pos.x
    const posY = this.target.pos.y

    ctx.moveTo(this.target.points[0][0] + posX, this.target.points[0][1] + posY)

    for (let i = 0; i < this.target.points.length; i++) {
      const [x, y] = this.target.points[i]
      ctx.lineTo(x + posX, y + posY)
    }

    ctx.stroke()
  }
}
