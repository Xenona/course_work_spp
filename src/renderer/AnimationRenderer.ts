import type { BoardAnimation } from '@/model/board/BoardAnimation'
import type { BoardGroup } from '../model/board/BoardGroup'
import { ObjectRenderer } from './ObjectRenderer'
import type { Renderer } from './Renderer'

export class AnimationRenderer extends ObjectRenderer<BoardAnimation> {
  render(r: Renderer, ctx: CanvasRenderingContext2D) {
    if (this.target.objects.length == 0) return

    const time = performance.now() / 500
    const id =
      this.target.objects[Math.floor(time) % this.target.objects.length]
    r.getObjectRenderer(id)!.render(r, ctx)
  }
}
