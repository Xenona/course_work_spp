import type { BoardAnimation } from '@/model/board/objects/BoardAnimation'
import type { BoardGroup } from '../model/board/BoardGroup'
import { ObjectRenderer } from './ObjectRenderer'
import type { Renderer } from './Renderer'
import { BoardDrawing } from '@/model/board/objects/BoardDrawing'

export class AnimationRenderer extends ObjectRenderer<BoardAnimation> {
  render(r: Renderer, ctx: CanvasRenderingContext2D) {
    if (this.target.objects.length == 0) return

    const time = (Date.now() / 500) * this.target.speed
    if (this.target.trajectoryMode) {
      const id = this.target.objects
      let drawing: BoardDrawing | null = null
      for (let i = id.length - 1; i >= 0; i--) {
        const obj = r.board.objects.get(id[i])
        if (obj instanceof BoardDrawing) {
          drawing = obj
          break
        }
      }

      const path = drawing?.points ?? [
        [0, 0],
        [0, 0],
      ]
      const firstPoint = path[0]
      const curPoint = path[Math.floor(time * 20) % path.length]
      ctx.save()
      ctx.translate(curPoint[0] - firstPoint[0], curPoint[1] - firstPoint[1])
      for (const id of this.target.objects) {
        if (id == drawing?.id) continue
        r.getObjectRenderer(id)!.render(r, ctx)
      }

      ctx.restore()
    } else {
      let shift =
        (Math.floor(time) + this.target.frameShift) % this.target.objects.length
      if (shift < 0) shift += this.target.objects.length

      const id = this.target.objects[shift]
      r.getObjectRenderer(id)!.render(r, ctx)
    }
  }
}
