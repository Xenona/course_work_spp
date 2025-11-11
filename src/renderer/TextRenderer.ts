import type { BoardText } from '@/model/board/objects/BoardText'
import { ObjectRenderer } from './ObjectRenderer'

export class TextRenderer extends ObjectRenderer<BoardText> {
  protected draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.target.stroke.color
    ctx.lineWidth = this.target.stroke.size * 0.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.font = `${this.target.charHeight}px "Courier new"`

    const lines = this.target.contents.split('\n')
    const { cx, cy, w, h } = this.target.getBoundingRect()
    let y = cy - h / 2 + this.target.charHeight
    const x = cx - w / 2

    for (const line of lines) {
      ctx.strokeText(line, x, y)
      y += this.target.charHeight
    }
  }
}
