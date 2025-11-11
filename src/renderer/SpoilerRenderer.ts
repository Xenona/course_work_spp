import { ObjectRenderer } from './ObjectRenderer'
import type { BoardShape } from '@/model/board/objects/BoardShape'
import type { Renderer } from './Renderer'

export class SpoilerRenderer extends ObjectRenderer<BoardShape> {
  constructor(target: BoardShape) {
    super(target)
  }

  public render(r: Renderer, ctx: CanvasRenderingContext2D) {
    r.onFrameEnd(() => this.draw(ctx))
  }

  protected draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = '#888'
    ctx.lineWidth = 12
    ctx.lineCap = 'square'
    ctx.lineJoin = 'bevel'

    ctx.strokeRect(
      this.target.pos.x - this.target.width / 2,
      this.target.pos.y - this.target.height / 2,
      this.target.width,
      this.target.height
    )

    ctx.strokeStyle = '#aaaaaa'
    ctx.fillStyle = '#aaa'
    ctx.lineWidth = 4

    if (!localStorage.getItem('spoiler')?.includes(this.target.id)) {
      ctx.fillRect(
        this.target.pos.x - this.target.width / 2,
        this.target.pos.y - this.target.height / 2,
        this.target.width,
        this.target.height
      )
    }

    ctx.lineWidth = 2
    ctx.strokeRect(
      this.target.pos.x - this.target.width / 2,
      this.target.pos.y - this.target.height / 2,
      this.target.width,
      this.target.height
    )
  }
}
