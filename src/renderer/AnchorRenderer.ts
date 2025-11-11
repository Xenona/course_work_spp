import { ObjectRenderer } from './ObjectRenderer'
import type { BoardAnchor } from '@/model/board/objects/BoardAnchor'

export class AnchorRenderer extends ObjectRenderer<BoardAnchor> {
  protected draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = 'blue'
    ctx.save()
    ctx.translate(this.target.pos.x, this.target.pos.y)
    ctx.scale(2, 2)
    ctx.beginPath()
    
    ctx.arc(0, -10, 10, 0.5, Math.PI-0.5)
    ctx.moveTo(0, 0)
    ctx.lineTo(0, -13)
    ctx.moveTo(2, -15)
    ctx.arc(0, -15, 2, 0, Math.PI*2)
    ctx.stroke()


    ctx.restore()
  }
}
