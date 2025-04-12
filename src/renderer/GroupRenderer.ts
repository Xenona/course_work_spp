import type { BoardGroup } from '../model/board/BoardGroup'
import { ObjectRenderer } from './ObjectRenderer'
import type { Renderer } from './Renderer'

export class GroupRenderer extends ObjectRenderer<BoardGroup> {
  render(r: Renderer, ctx: CanvasRenderingContext2D) {
    // for (const obj of this.target.objects) {
    //   r.addObject(obj)
      
    //   r.getObjectRenderer(obj.id)!.render(r, ctx)
    // }
  }
}
