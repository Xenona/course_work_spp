import { ObjectRenderer } from './ObjectRenderer'
import type { BoardShape } from '@/model/board/objects/BoardShape'

export class ShapeRenderer extends ObjectRenderer<BoardShape> {
  constructor(target: BoardShape) {
    super(target)
  }

  protected draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.target.stroke.color
    ctx.lineWidth = this.target.stroke.size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (this.target.filled) {
      ctx.fillStyle = this.target.stroke.color
      ctx.fillRect(
        this.target.pos.x - this.target.width / 2,
        this.target.pos.y - this.target.height / 2,
        this.target.width,
        this.target.height
      )
    }

    ctx.strokeRect(
      this.target.pos.x - this.target.width / 2,
      this.target.pos.y - this.target.height / 2,
      this.target.width,
      this.target.height
    )
  }
}
